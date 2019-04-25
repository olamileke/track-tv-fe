import { Component, OnInit, ViewChild, Renderer2, HostListener } from '@angular/core';

import { UserService } from '../user.service';

import { AuthService } from '../auth.service';

import { InteractionsService } from '../interactions.service';

import { ConfigService } from '../config.service';

import { ActivatedRoute } from '@angular/router';

import { SubscriptionsComponent } from '../subscriptions/subscriptions.component';

import { TopRatedComponent } from '../top-rated/top-rated.component';

import { PopularComponent } from '../popular/popular.component';

import { GenreComponent } from '../genre/genre.component';

import { HeaderComponent } from '../header/header.component';

import { SidebarComponent } from '../sidebar/sidebar.component';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css', './home-loggedin.component.css', '../css/overlay.css']
})
export class HomeComponent implements OnInit {

  @ViewChild('hamburger') hamburger; 

  @ViewChild('nav') nav; 

  @ViewChild('overlay') overlay;  

  @ViewChild('imageOverlay') imageOverlay;

  @ViewChild( HeaderComponent ) header:HeaderComponent;

  @ViewChild( SubscriptionsComponent ) subscriptions:SubscriptionsComponent;

  @ViewChild( PopularComponent ) popular:PopularComponent;

  @ViewChild( TopRatedComponent ) toprated:TopRatedComponent;

  @ViewChild( GenreComponent ) genre_component:GenreComponent;

  @ViewChild( SidebarComponent ) sidebar:SidebarComponent;
 
  loggedin:boolean;

  imageUpload:boolean=false;

  // PROPERTIES THAT WILL BE INJECTED INTO THE GENRE COMPONENT TO USE TO UNIQUELY IDENTIFY THE SUB GENRE 
  // THAT IS TO BE FETCHED

  genre:string;

  genreId:Number;

  is_sidebar_visible:boolean=true;

  // SCREEN 500px AND BELOW

  smallScreen:boolean=false;
 
  constructor(private renderer:Renderer2, private userservice:UserService,
              private auth:AuthService, private interactions:InteractionsService,
              private config:ConfigService, private router:ActivatedRoute) { }

  ngOnInit() {
 
    this.loggedin=this.auth.isAuthenticated();

    setTimeout(() => {

       if(this.config.profileImage.includes('anon.png')){

          this.imageUpload=this.interactions.toggleImageUploadComponent(this.renderer, this.imageOverlay.nativeElement, this.imageUpload);
        }

    },1500);


    // KNOWING WHICH COMPONENT TO DISPLAY

    const tab=this.router.snapshot.paramMap.get('tab') === null ? this.router.snapshot.paramMap.get('genre') : this.router.snapshot.paramMap.get('tab');

    this.determineComponent(tab);

    if(screen.width <= 768 && screen.width > 500) {

      this.is_sidebar_visible=false;
    }

  }

  // DETERMINING WHICH COMPONENT SHOULD BE DISPLAYED BASED ON THE CONTENTS OF THE ADDRESS BAR

  determineComponent(component:string):boolean{

     if(document.URL.includes('genre')) {

         this.conditions.genre=true;

         this.genre=component.charAt(0).toUpperCase() + component.slice(1).toLowerCase();

         this.genreId=this.genres[component.toLowerCase()];

         return true;
     }

     this.conditions[component.toLowerCase()]=true;

     return true;
  }


  // TOGGLING THE NAVIGATION BAR ON A SMALL SCREEN (IPAD - 768px) AND LOWER

  toggleNav(){ 
    
    this.hamburger.nativeElement.classList.toggle('active');

    this.nav.nativeElement.classList.toggle('show');
  }


  // LOGGED IN COMPONENT METHODS AND PROPERTIES

  @ViewChild('loggedinmain') loggedinmain;


  @HostListener('window:scroll', ['$event'])
  scrollHandler() {

    if(window.pageYOffset > 68) {

      this.renderer.addClass(this.loggedinmain.nativeElement, 'sticky-header');
    }
    else {

      this.renderer.removeClass(this.loggedinmain.nativeElement, 'sticky-header')
    }
  }



  conditions={subscriptions:false, popular:false, toprated:false, explore:false, genre:false};

  genres={action:'10759', animation:'16', comedy:'35', crime:'80', documentary:'99', drama:'18', family:'10751',
          kids:'10762', mystery:'9648', news:'10763', reality:'10764', scifi:'10765', soap:'10766', talk:'10767',
         politics:'10768', western:'37'}


  // TOGGLING THE CURRENTLY VIEWED TAB

  toggleTab(tab:any):boolean {

    // CLOSING THE SIDEBAR WHEN NAVIGATING TO A DIFFERENT COMPONENT WHEN ON A SCREEN BETWEEN 768px AND 500px

    if(screen.width <= 768 && screen.width > 500) {

      this.renderer.removeClass(this.loggedinmain.nativeElement, 'sidebar-visible');

      this.is_sidebar_visible=false;
    }


    // CLOSING THE SIDEBAR WHEN NAVIGATING TO A DIFFERENT COMPONENT ON A SCREEN BELOW 500px 

    if(screen.width <= 500) {

       this.smallScreen=false;

       this.renderer.removeClass(this.overlay.nativeElement, 'active');
    }


    // DISPLAYING THE GENRE TAB AND DETERMINING THE SUB GENRRE TO BE DISPLAYED

    if(String(tab).includes('genre'))
    {
        const component=String(tab).split('/')[1];

         this.conditions.genre=false;
         this.conditions.subscriptions=false;
         this.conditions.popular=false;
         this.conditions.toprated=false;
         this.conditions.explore=false;

         this.genre=component.charAt(0).toUpperCase() + component.slice(1).toLowerCase();

         this.genreId=parseInt(this.genres[component]);

         setTimeout(() => {
              
           this.conditions.genre=true;

           return true;

         }, 1)
    }

    const conditions=Object.keys(this.conditions);

    for(let i=0; i < conditions.length; i++) {

      this.conditions[conditions[i]]=false;
    }

    this.conditions[tab]=true;

    return true;
  }

  // TOGGLING THE DISPLAY OF THE SIDEBAR

  toggleSideBar():boolean{

    this.is_sidebar_visible=this.interactions.toggleSideBarVisible(this.is_sidebar_visible, this.renderer, this.loggedinmain.nativeElement);

    this.smallScreen=this.interactions.toggleSideBarSmall(this.smallScreen, this.overlay.nativeElement);

    return true;
  }


  // CLOSING THE SIDEBAR WHEN THE BODY IS CLICKED WHEN WE ARE ON A SMALL SCREEN

  closeSidebar() {

   this.smallScreen=this.interactions.closeSidebar(this.smallScreen, this.renderer, this.overlay.nativeElement);
  }
  

  // CLOSING THE IMAGE UPLOAD COMPONENT

  closeImageUpload(event) {

     this.imageUpload=this.interactions.toggleImageUploadComponent(this.renderer, this.imageOverlay.nativeElement, this.imageUpload);
    
     if(screen.width > 500) {

       this.header.imgsrc=event;
     }
     else {

       this.sidebar.imgsrc=event;
     }
  }


}
					