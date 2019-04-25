import { Component, OnInit , Output, HostListener, Renderer2, ElementRef, EventEmitter, ViewChild } from '@angular/core';

import { debounceTime, switchMap, distinctUntilChanged } from 'rxjs/operators';

import { Observable, Subject } from 'rxjs';

import { ConfigService } from '../config.service';

import { Router } from '@angular/router';

import { TvService } from '../tv.service';

import { AuthService } from '../auth.service';

import { NotificationsService } from '../notifications.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  // CREATING THE EVENT THAT WILL BE USED TO TOGGLE THE DISPLAY OF THE SIDEBAR ON A SMALL SCREEN(IPAD, 768px)

  @Output() displaySideBar=new EventEmitter();

  @Output() clickHome=new EventEmitter();

  @ViewChild('searchContainer') searchContainer;

  searchResults;

  searchTerms=new Subject<string>();

  // TOGGLING THE HEADER'S STICKINESS ONCE WE ARE ON AN IPAD(768px) SCREEN AND BELOW

  @HostListener('window:scroll', ['$event'])
  scrollHandler() {

  	// if(window.pageYOffset >= 68) {

  	// 	this.renderer.addClass(this.elRef.nativeElement, 'fixed');
  	// }
  	// else {

  	// 	this.renderer.removeClass(this.elRef.nativeElement, 'fixed');  		
  	// }
  }

  mediumScreen:boolean=false;

  smallScreen:boolean=false;

  showSearch:boolean=false;

  count:number;

  name:string=JSON.parse(sessionStorage.profile).name;

  imgsrc:string;

  showOptions:boolean=false;

  constructor(private renderer:Renderer2, private elRef:ElementRef,
              private tv:TvService, private config:ConfigService,
              private auth:AuthService, private router:Router, 
              private notification:NotificationsService) { }

  ngOnInit() {

  	if(screen.width <= 768 && screen.width > 500) {

  		this.mediumScreen=true;
  	}

    if(screen.width <= 500) {

      this.smallScreen=true;
    }
    

    this.imgsrc=this.config.profileImage;
  }

  

  // TOGGLING THE SEARCH BAR DISPLAY ON A SMALL SCREEN (768px and below)

  toggleSearch() {

    if(this.showSearch) {

      this.renderer.removeClass(this.searchContainer.nativeElement, 'active');

      this.searchResults=[];
    }

  	this.showSearch=!this.showSearch;
  }

  // EMITTING THE EVENT TO TOGGLE THE DISPLAY OF THE SIDEBAR ON A SMALL SCREEN (IPAD, BELOW 768px)

  emitSideBarEvent(elem?:string) {

      this.displaySideBar.emit();
  }


  // EMITTING THE EVENT TO DISPLAY THE SUBSCRIPTIONS COMPONENT (HOME/DEFAULT COMPONENT)

  emitHomeEvent() {

    this.clickHome.emit('subscriptions');
  }


  // OBTAINING THE SEARCH RESULTS

  searchTvSeries(term:string) {

    this.showOptions=false;

    if(term.length > 0) {

      this.searchTerms.next(term);
      
      this.searchTerms.pipe(

        debounceTime(300),

        distinctUntilChanged(),

        switchMap((term:string) => this.tv.fetchSearchResults(term)),

      ).subscribe((res:any) => {

           if(res.results.length > 0 && this.count > 0) {

             this.searchResults= res.results.slice(0,5);

             this.renderer.addClass(this.searchContainer.nativeElement, 'active');
           }
           else {

             this.searchResults=[];

             this.renderer.removeClass(this.searchContainer.nativeElement, 'active');
           }

       });

    }
    else {

      this.searchResults=[];

      this.renderer.removeClass(this.searchContainer.nativeElement, 'active');

    }

    this.count=term.length;

  }


  // OBTAINING THE SLUG TO DISPLAY IN THE URL FROM THE TV SHOW NAME

  getSlug(name:string):string {

    const slug=name.replace(/ /g, '-').toLowerCase();

    return slug;
  }


  // TOGGLING THE DISPLAY OF THE OPTIONS TAB

  toggleOptions() {

    // CLOSING THE SEARCH RESULTS BOX IF THE USER CLICKS THE OPTIONS TAB

    if(!this.showOptions) {

      this.searchResults=[];

      this.renderer.removeClass(this.searchContainer.nativeElement, 'active');
    }

    this.showOptions=!this.showOptions;
  }


  // LOGGING THE USER OUT OF THE APPLICATION

  logout() {

     this.auth.logout().subscribe((res:any) => {

        if(res.status === undefined) {

           this.auth.unSetUserData();

           this.router.navigate(['/login']);

           this.notification.showSuccessMsg('Logged out successfully');

          }
     })
  }

}
