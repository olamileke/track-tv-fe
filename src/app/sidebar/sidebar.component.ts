import { Component, OnInit, Output, EventEmitter, HostListener, ElementRef, Renderer2, ViewChild } from '@angular/core';

import { ConfigService } from '../config.service';

import { AuthService } from '../auth.service';

import { Router } from '@angular/router';

import { NotificationsService } from '../notifications.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit{

  @Output() toggleTab=new EventEmitter();

  // DOCKING THE SIDEBAR AND MAKING IT FIXED WHEN THE HEADER DISAPPEARS OUT OF VIEW

  @HostListener('window:scroll', ['$event'])
  scrollHandler() {

      const heightval=56 + (0.03 * screen.height);

      if(window.pageYOffset >= heightval && screen.width > 768) {
        
          this.renderer.addClass(this.elRef.nativeElement, 'fixed');
      }
      else {

          this.renderer.removeClass(this.elRef.nativeElement, 'fixed');
      }
  }

  tabs={subscriptions:true, popular:false, toprated:false, explore:false};

  genres={action:false, animation:false, comedy:false, crime:false, documentary:false, drama:false,family:false,
          kids:false, mystery:false, news:false, reality:false, scifi:false,talk:false, politics:false};

  hideGenres:boolean=true;

  name:string;

  below_500_px:boolean=false;

  mediumScreen:boolean=false;

  toggleOptions:boolean=false;

  editStyles={fontSize:'0.9em',fontFamily:'Raleway',color:'rgba(0,0,0,0.5)',width:'100px'};

  @ViewChild('genreslist') genreslist;

  @ViewChild('caret') caret;

  @ViewChild('clickgenre') clickgenre; 

  imgsrc:string;

  constructor(private elRef:ElementRef, private renderer:Renderer2,
              private config:ConfigService, private auth:AuthService,
              private notification:NotificationsService, private router:Router) { }

  ngOnInit() {

    let tab=document.URL.split('4200/')[1];

    this.name=this.checkStorage() == false ? JSON.parse(localStorage.profile).name : JSON.parse(sessionStorage.profile).name;

    // SETTING THE ACTIVE TAB WHEN THE USER RELOADS THE PAGE (WHEN LOGGED IN)

    if(tab !== undefined) {

        this.setActiveTab(tab.toLowerCase());
    }

    this.imgsrc=this.config.profileImage;

    if(screen.width <= 768 && screen.width > 500) {

      this.mediumScreen=true;

      const val=-1 * ((768 - screen.width)/2);

      const stringval=String(val) + 'px';

      this.renderer.setStyle(this.elRef.nativeElement, 'marginLeft', stringval);

      // ADDING THE CLASS FOR THE BRIEF ANIMATION WHEN THE SIDEBAR IS DISPLAYED
      // BETWEEN 500px AND 768px

      setTimeout(() => 
      {
          this.renderer.addClass(this.elRef.nativeElement, 'active');

      },200)

    }

    if(screen.width <= 500) {

      this.below_500_px=true;
    }

  }

  // CHECKING SESSION STORAGE FOR USER INFORMATION

  checkStorage():boolean {

      if(sessionStorage.profile == '' || sessionStorage.profile == undefined) {

         return false;
      }

      return true;
  }


  // EMITTING THE TAB CHANGED EVENT TO THE PARENT HOME COMPONENT TO KNOW WHICH SUB COMPONENT TO DISPLAY

  emitToggleEvent(tab:string) {

  	this.toggleTab.emit(tab);

    // ADDING THE ACTIVE COLOR CLASS TO THE LINK JUST CLICKED

    this.setActiveTab(tab);

  }


  // SETTING THE ACTIVE TAB 

    setActiveTab(tab:string):boolean {

      // ESSENTIALLY WHAT I AM DOING HERE IS CHECKING IF IS A SUB GENRE THAT WAS CLICKED
      // AND SETTING THE ACTIVE CLASS TO THE CORRECT SUB-GENRE
      // IF IT WAS NOT A SUB GENRE THAT WAS CLICKED, IT WILL PROCEED NORMALLY
      // AND SET ONE OF THE MAIN TABS AS ACTIVE AS IT USUALLY DOES

       if(String(tab).includes('genre'))
       {
          let subgenre=String(tab).split('/')[1];


          for(let i=0; i < Object.keys(this.genres).length; i++) {
   
             this.genres[Object.keys(this.genres)[i]]=false;
         
          } 

          this.genres[subgenre]=true;

          this.unToggle(this.tabs);

          return true;
       }

        const tabKeys=Object.keys(this.tabs);

        for(let i=0; i < tabKeys.length; i++) {

         this.tabs[tabKeys[i]]=false;
       
        } 

        this.unToggle(this.genres);

        this.tabs[tab]=true;

        return true;
     }


  // REMOVING THE ACTIVE CLASS FROM THE SIDEBAR

    unToggle(object:any) {

      const keys=Object.keys(object);

      for(let i=0; i < keys.length; i++) {

        object[keys[i]]=false;
      }

    }


  // TOGGLING THE DISPLAY OF THE GENRES ABOVE 768px(IPAD)

    toggleGenresDisplay():boolean {

      if(this.hideGenres) {

          this.renderer.addClass(this.clickgenre.nativeElement, 'show');
          this.renderer.addClass(this.genreslist.nativeElement, 'show');
          this.renderer.removeClass(this.caret.nativeElement, 'fa-caret-right');
          this.renderer.addClass(this.caret.nativeElement, 'fa-caret-down');

          this.hideGenres=!this.hideGenres;

          return true;
      }

      this.renderer.removeClass(this.clickgenre.nativeElement, 'show');
      this.renderer.removeClass(this.genreslist.nativeElement, 'show');
      this.renderer.removeClass(this.caret.nativeElement, 'fa-caret-down');
      this.renderer.addClass(this.caret.nativeElement, 'fa-caret-right');

      this.hideGenres=!this.hideGenres;
    }

    // LOGGING THE USER OUT OF THE APPLICATION

    logout() {

        this.auth.logout().subscribe((res:any) => {           

         this.auth.unSetUserData();

         this.router.navigate(['/login']);

         this.notification.showSuccessMsg('Logged out successfully');         
       })
    }


    showOptions() {

      this.toggleOptions=!this.toggleOptions;
    }

}
