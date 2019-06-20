import { Component, OnInit , OnDestroy, Output, HostListener, Renderer2, ElementRef, EventEmitter, ViewChild } from '@angular/core';

import { debounceTime, switchMap, distinctUntilChanged } from 'rxjs/operators';

import { Observable, Subject, throwError } from 'rxjs';

import { catchError, takeUntil } from 'rxjs/operators';

import { ConfigService } from '../config.service';

import { Router } from '@angular/router';

import { TvService } from '../tv.service';

import { AuthService } from '../auth.service';

import { UserService } from '../user.service';

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

  @Output() tvShow=new EventEmitter();

  @Output() imageUpload=new EventEmitter();

  @ViewChild('searchContainer') searchContainer;

  @ViewChild('inputlarge') inputlarge;

  @ViewChild('inputsmall') inputsmall;

  private onDestroy$:Subject<void>=new Subject<void>();

  searchResults=[];

  load_logout:boolean=false;

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

  name:string;

  imgsrc:string;

  showOptions:boolean=false;

  constructor(private renderer:Renderer2, private elRef:ElementRef,
              private tv:TvService, private config:ConfigService,
              private auth:AuthService, private router:Router, 
              private notification:NotificationsService, private userservice:UserService) { }

  ngOnInit() {

  	if(screen.width <= 768 && screen.width > 500) {

  		this.mediumScreen=true;
  	}

    if(screen.width <= 500) {

      this.smallScreen=true;
    }

    this.name=this.checkStorage() == false ? JSON.parse(localStorage.profile).name : JSON.parse(sessionStorage.profile).name;
   
    this.imgsrc=this.config.profileImage;
  }


  ngOnDestroy() {

    this.onDestroy$.next();
  }

  // CHECKING SESSION STORAGE FOR USER INFORMATION

  checkStorage():boolean {

      if(sessionStorage.profile == '' || sessionStorage.profile == undefined) {

         return false;
      }

      return true;
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
      
      this.searchTerms.pipe(debounceTime(300),distinctUntilChanged(),switchMap((term:string) => this.tv.fetchSearchResults(term))).pipe(takeUntil(this.onDestroy$)).subscribe((res:any) => {

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

      this.clearSearch()
    }

    this.showOptions=!this.showOptions;
  }


  // LOGGING THE USER OUT OF THE APPLICATION

  logout() {

    this.load_logout=true;

     this.auth.logout().pipe(catchError(this.handleError()), takeUntil(this.onDestroy$)).subscribe((res:any) => {

         this.auth.unSetUserData();

         this.router.navigate(['/login']);

         this.userservice.subscribedIDs=[];

         this.userservice.subscribedInfo=[];

         this.tv.subscribedTvShows=[];

         this.notification.showSuccessMsg('Logged out successfully');
     })
  }

  // ERROR HANDLER FOR LOGOUT

  handleError() {

      return (error:any) => {

        this.load_logout=false;

        this.notification.showErrorMsg('There was a problem processing your request', 'Error');

        return throwError(error);
      }
  }


  // EMITTING AN EVENT TO LOAD THE NEW TV SHOW WHEN WE ARE ON THE TV SHOW DETAIL VIEW

  emitTvShow(id) {

     this.tvShow.emit(id);

     this.searchResults=[];

     this.renderer.removeClass(this.searchContainer.nativeElement, 'active');
   }



   checkInputLength():boolean {

       if(this.searchResults.length > 0) {

         return true;
       }

       return false;
   }


   // CLEARING THE SEARCH INPUT

   clearSearch():void {

     this.searchResults=[];

     this.renderer.removeClass(this.searchContainer.nativeElement, 'active');

     if(screen.width > 768) {

       this.renderer.setProperty(this.inputlarge.nativeElement, 'value', ' ');

     }
     else {

       this.renderer.setProperty(this.inputsmall.nativeElement, 'value', ' ');
     }
   }


   // EMITTING THE EVENT TO THE HIGHER COMPONENT TO DISPLAY THE IMAGE UPLOAD DIALOG 

   emitImageUpload() {

      this.imageUpload.emit();

      this.showOptions=false;
   }
}
