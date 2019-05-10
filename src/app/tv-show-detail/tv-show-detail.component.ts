import { Component, OnInit, ViewChild, Renderer2 } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { HeaderComponent } from '../header/header.component';

import { InteractionsService } from '../interactions.service';

import { NotificationsService } from '../notifications.service';

import { UserService } from '../user.service';

import { Location } from '@angular/common';

import { TvService } from '../tv.service';

import { interval } from 'rxjs';

import { TvShow } from '../tv-show';

@Component({
  selector: 'app-tv-show-detail',
  templateUrl: './tv-show-detail.component.html',
  styleUrls: ['./tv-show-detail.component.css', '../css/overlay.css']
})
export class TvShowDetailComponent implements OnInit {

  @ViewChild('overlay') overlay; 

  @ViewChild('dialog_overlay') dialog_overlay;

  @ViewChild('main') main;

  @ViewChild('nextepisodedate') episodeCountdown; 

  @ViewChild('actionbtn') actionbtn;

  @ViewChild('container') container;

  TvShow:any={};

  next_episode:any;

  fetchedTvShow:boolean=false;

  countdown:string;

  episodeInterval=interval(1000);

  visitedIDs=[];

  episodeTime:number;

  details={};

  episodeDate:string;

  below_768px:boolean=false;

  hasSubscribed:boolean=false;

  subloading:boolean=false;;  

  displayUnsubscribeDialog:boolean=false;

  isTodayNextEpisode:boolean=false;

  showEpisodeInfo:boolean=false;

  similarShows=[];

  response:any;

  similarCount:number;

  showInfo:any={};

  cast;

  constructor(private route:ActivatedRoute, private renderer:Renderer2,
              private interactions:InteractionsService, private tv:TvService,
              private userservice:UserService, private notification:NotificationsService, private location:Location) { }

  displayShadow:boolean=true;

  is_sidebar_visible:boolean=false;

  smallScreen:boolean=false;

  ngOnInit() {

    // ENSURING THAT WHEN THIS VIEW IS DISPLAYED, WE ARE STARTING AT THE TOP OF THE SCREEN

    document.body.scrollTop = 0; // For Safari

    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera

    if(screen.width <= 768) {

      this.below_768px=true;
    }

    const id=this.route.snapshot.paramMap.get('id');

    this.fetchShowDetails(parseInt(id));

    this.checkSubscribed(parseInt(id));

  	if(screen.width <= 500) {

      this.is_sidebar_visible=true;
    }

  }


  // CHECKING IF THE USER HAS SUBSCRIBED TO THE TV SHOW ON DISPLAY

  checkSubscribed(id:number):boolean{

     if(this.userservice.subscribedIDs.length > 0) {

         if(this.userservice.subscribedIDs.includes(id)) {

           this.hasSubscribed=true;
         }

         return true;
     }

     this.userservice.hasSubscribed(id).subscribe((res:any) => {

         this.hasSubscribed=res.data;
     })
  }


  // GRABBING THE DETAILS OF THE PARTICULAR TV SERIES TO DISPLAY

  fetchShowDetails(id) {

     this.fetchedTvShow=false;

     this.hasSubscribed=false;

     this.isTodayNextEpisode=false;

     this.countdown='';

     this.visitedIDs.push(id);

     this.checkSubscribed(id);

     // ENSURING THAT WHEN THIS VIEW IS DISPLAYED, WE ARE STARTING AT THE TOP OF THE SCREEN

    document.body.scrollTop = 0; // For Safari

    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera

     this.tv.getShowDetail(id, true).subscribe((res:any) => {

         let tvshow=new TvShow(res.id, res.name,res.overview,`http://image.tmdb.org/t/p/w1280${res.backdrop_path}`,
             this.tv.getAirDateString(res.first_air_date),
             res.vote_average, this.tv.constructGenresString(res.genres),
              res.in_production,'');

         this.TvShow=tvshow;

         this.response=res;

         this.next_episode=res.next_episode_to_air;

         this.composeDetails(`http://image.tmdb.org/t/p/w1280${res.poster_path}`, res.original_name, id);

         this.determineSimilarCount();

         this.setSimilarShows(res.similar.results);

         this.setCast(res.credits.cast);

         this.getCountdown(this.next_episode);

         this.setShowInfo(res);

         this.fetchedTvShow=true;

         console.log(res);
     })
  }


  // COMPOSING THE DETAILS OBJECT WHICH WILL BE INJECTED INTO THE CHILD UNSUBSCRIBE COMPONENT

  composeDetails(imgpath:string, name:string, id:number) {

     this.details['imgpath']=imgpath;

     this.details['name']=name;

     this.details['id']=id;
  }

  // KNOWING HOW MANY SIMILAR TV SHOWS WE ARE TO DISPLAY

  determineSimilarCount() {

    if(screen.width > 991) {

      if(!this.TvShow.in_production) {

         this.similarCount=7;
      }
      else {

        this.similarCount=5;
      }

    }
    else {

      this.similarCount=10;
    }
  }


  // SETTING THE showInfo object to post to the backend when the user subscribes to the tv show

  setShowInfo(res) {

      if(res.in_production && this.next_episode !== null) {

        this.showInfo.show_id=res.id;

        this.showInfo.name=res.original_name;

        this.showInfo.imagepath=`http://image.tmdb.org/t/p/w1280${res.poster_path}`;

        this.showInfo.next_episode_air_date=res.next_episode_to_air.air_date;

        this.showInfo.next_episode_number=res.next_episode_to_air.episode_number;

        this.showInfo.next_episode_season=res.next_episode_to_air.season_number;

        this.showInfo.about_episode=res.next_episode_to_air.overview;
      }
  }

  // SETTING THE SHOW DETAILS IN THE SIMILAR SHOWS PROPERTY

  setSimilarShows(shows) {

     this.similarShows=[];

     let i=0;

     while(i < this.similarCount) {

       let val=Math.round(Math.random() * (shows.length - 1));

       if(this.similarShows.indexOf(shows[val]) == -1) {

          this.similarShows.push(shows[val]);

          i++;
       }

     }
  }


  // GETTING THE CAST OF THE TV SHOW

  setCast(cast) {

     this.cast=cast.slice(0,8);
  }

  // OBTAINING THE COUNTDOWN STRING TO DISPLAY

  getCountdown(episode:any):void {

      if(episode !== null) {

         const date=episode.air_date;

         const year=date.slice(0,4);

         const month=date.slice(5,7);

         const day=date.slice(8,10);

         this.getDateString(parseInt(day), parseInt(month), parseInt(year));
      }
  }


  // GETTING THE DAY THE NEXT EPISODE IS TO BE RELEASED AS A STRING

  getDateString(day:number, month:number, year:number):void {

    const montharray=['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    this.episodeDate=`${day} ${montharray[month - 1]}, ${year}`; 

    const date=new Date();

    if(date.getDate() == day && date.getMonth() == month - 1 && date.getFullYear() == year) {

       this.isTodayNextEpisode=true;
    }   

    return this.getInterval(`${day} ${montharray[month - 1]}, ${year}`);    

  }


  // CREATING THE COUNTDOWN FOR WHEN THE NEXT EPISODE IS TO BE RELEASED

  getInterval(datestr:string):void {

      this.episodeTime=new Date(datestr).getTime();

      this.episodeInterval.subscribe(() => {

          let now=new Date().getTime();

          if(this.episodeTime > now) {

            let difference=this.episodeTime - now;

            let days=Math.floor(difference/(1000 * 60 * 60 * 24));

            let hours=Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

            let minutes=Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

            let seconds=Math.floor((difference % (1000 * 60)) / 1000);

            this.countdown=`${days}d ${hours}h ${minutes}m ${seconds}s`;
          }
      })
  }


  // SUBSCRIBE TO A TV SHOW

  subscribe():boolean {

      if(!this.hasSubscribed){ 

        this.subloading=true;

        this.userservice.subscribe(JSON.stringify(this.showInfo)).subscribe((res:any) => {

          this.notification.showSuccessMsg('Subscribed successfully');

          this.hasSubscribed=true;

          this.subloading=false;

          const id=this.route.snapshot.paramMap.get('id');

          this.userservice.subscribedIDs.push(parseInt(id));

          this.tv.subscribedTvShows.push(this.composeTvShowObject(this.response));

          this.userservice.subscribedInfo.push(this.composeShowInfo());
        })

        return true;
      }

      this.displayUnsubscribeDialog=true;

      this.renderer.addClass(this.dialog_overlay.nativeElement, 'episodeActive');
      
      this.renderer.addClass(this.container.nativeElement, 'hidden');

  }  


  // CREATING THE TV SHOW OBJECT TO ADD TO THE SUBSCRIBED TV SHOWS ARRAY WHEN THE USER SUBSCRIBES TO IT

  composeTvShowObject(res:any):any {

    if(screen.width > 412) {

      let tvshow=new TvShow(res.id, res.name,res.overview,`http://image.tmdb.org/t/p/w1280${res.poster_path}`,
             this.tv.getAirDateString(res.first_air_date),
             res.vote_average, this.tv.constructGenresString(res.genres),
              res.in_production,'');

       return tvshow;
     }

    let tvshow=new TvShow(res.id, res.name,res.overview,`http://image.tmdb.org/t/p/w1280${res.backdrop_path}`,
           this.tv.getAirDateString(res.first_air_date),
           res.vote_average, this.tv.constructGenresString(res.genres),
            res.in_production,'');

    return tvshow;
  }


  composeShowInfo() {

    let showInfo={'about_episode':this.TvShow.overview, 'name':this.TvShow.name, 'next_episode_air_date':this.next_episode.air_date,
                  'next_episode_number':this.next_episode.episode_number, 'next_episode_season':this.next_episode.season_number,
                   show_id:this.TvShow.id, created_at:this.getCurrentTime()};

    return showInfo;
  }


  // OBTAINING THE CURRENT TIME IN Y-M-D H:M:S

  getCurrentTime():string {

     let date=new Date();

     let year=date.getFullYear();

     let month=(date.getMonth()) + 1;

     let day=date.getDate();

     let hour=(date.getHours()) + 1;

     let minutes=(date.getMinutes()) + 1;

     let seconds=(date.getSeconds()) + 1;

     return `${year}-${month}-${day} ${hour}:${minutes}:${seconds}`;
  }


  // UNSUBSCRIBING FROM A TV SHOW

  unsubscribe(event:any) {

       this.closeDialog();

       this.subloading=true;

       this.userservice.unsubscribe(parseInt(event)).subscribe((res:any) => {

         this.notification.showSuccessMsg('Succesfully unsubscribed');

         this.hasSubscribed=false;  

         this.subloading=false;

         this.userservice.deleteSubscriptionID(parseInt(event));
    })
  }


   // TOGGLING THE DISPLAY OF THE SIDEBAR

  toggleSideBar():boolean {

    this.is_sidebar_visible=this.interactions.toggleSideBarVisible(this.is_sidebar_visible, this.renderer, this.overlay.nativeElement, this.container.nativeElement);

    this.smallScreen=this.interactions.toggleSideBarSmall(this.smallScreen, this.overlay.nativeElement);

    return true;
  }


  // CLOSING THE UNSUBSCRIBE AND VIEW NEXT EPISODE DIALOGS

  closeDialog() {

     this.closeNextEpisodeInfo();

     this.closeUnSubscribeDialog();

     this.renderer.removeClass(this.dialog_overlay.nativeElement, 'episodeActive');

     this.renderer.removeClass(this.container.nativeElement, 'hidden'); 
  }


  // DETERMINING IF ANY NEXT EPISODE INFORMATION WILL BE DISPLAYED

  hasNextEpisode():boolean {

    if(this.next_episode !== null) {
      
      return true;
    }

    return false;
  }

  // VIEWING THE NEXT EPISODE INFORMATION

  viewEpisodeInfo() {

    this.showEpisodeInfo=true;

    this.renderer.addClass(this.dialog_overlay.nativeElement, 'episodeActive');

    this.renderer.addClass(this.container.nativeElement, 'hidden');

  }

  // CLOSING THE NEXT EPISODE DIALOG

  closeNextEpisodeInfo() {

    this.showEpisodeInfo=false;

  }


  // CLOSING THE UNSUBSCRIBE DIALOG

  closeUnSubscribeDialog() {

     this.displayUnsubscribeDialog=false;
  }


  goBack() {

      if(this.visitedIDs.length > 1) {

        // alert(this.visitedIDs);

        let index=this.visitedIDs.length - 2;

        this.fetchShowDetails(this.visitedIDs[index]);

        this.visitedIDs.splice(index,2);
      }
      else {

        this.location.back();
      }
  }

}
