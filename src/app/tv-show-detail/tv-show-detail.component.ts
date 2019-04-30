import { Component, OnInit, ViewChild, Renderer2 } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { HeaderComponent } from '../header/header.component';

import { InteractionsService } from '../interactions.service';

import { NotificationsService } from '../notifications.service';

import { UserService } from '../user.service';

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

  @ViewChild('main') main;

  @ViewChild('nextepisodedate') episodeCountdown; 

  @ViewChild('actionbtn') actionbtn;

  TvShow:any={};

  next_episode:any;

  fetchedTvShow:boolean=false;

  countdown:string;

  episodeInterval=interval(1000);

  episodeTime:number;

  episodeDate:string;

  hasSubscribed:boolean=false;

  isTodayNextEpisode:boolean=false;

  similarShows=[];

  similarCount:number;

  showInfo:any={};

  cast;

  constructor(private route:ActivatedRoute, private renderer:Renderer2,
              private interactions:InteractionsService, private tv:TvService,
              private userservice:UserService, private notification:NotificationsService) { }

  displayShadow:boolean=true;

  is_sidebar_visible:boolean=false;

  smallScreen:boolean=false;

  ngOnInit() {

    // ENSURING THAT WHEN THIS VIEW IS DISPLAYED, WE ARE STARTING AT THE TOP OF THE SCREEN

    document.body.scrollTop = 0; // For Safari

    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera

    const id=this.route.snapshot.paramMap.get('id');

    this.fetchShowDetails(parseInt(id));

    this.hasSubscribed=false;

    this.userservice.hasSubscribed(parseInt(id)).subscribe((res:any) => {

        console.log(res);
        if(res.data) {

            this.hasSubscribed=true;
        }
    });

  	if(screen.width <= 500) {

      this.is_sidebar_visible=true;
    }

  }


  // GRABBING THE DETAILS OF THE PARTICULAR TV SERIES TO DISPLAY

  fetchShowDetails(id) {

     this.fetchedTvShow=false;

     this.isTodayNextEpisode=false;

     this.countdown='';

     // ENSURING THAT WHEN THIS VIEW IS DISPLAYED, WE ARE STARTING AT THE TOP OF THE SCREEN

    document.body.scrollTop = 0; // For Safari

    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera

     this.tv.getShowDetail(id, true).subscribe((res:any) => {

         let tvshow=new TvShow(res.id, res.name,res.overview,`http://image.tmdb.org/t/p/w1280${res.backdrop_path}`,
             this.tv.getAirDateString(res.first_air_date),
             res.vote_average, this.tv.constructGenresString(res.genres),
              res.in_production,'');

         this.TvShow=tvshow;

         this.next_episode=res.next_episode_to_air;

         this.determineSimilarCount();

         this.setSimilarShows(res.similar.results);

         this.setCast(res.credits.cast);

         this.getCountdown(this.next_episode);

         this.setShowInfo(res);

         this.fetchedTvShow=true;

         console.log(res);
     })

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

      if(res.in_production) {

        this.showInfo.show_id=res.id;

        this.showInfo.name=res.original_name;

        this.showInfo.imagepath=`http://image.tmdb.org/t/p/w1280${res.poster_path}`;

        this.showInfo.next_episode_air_date=res.next_episode_to_air.air_date;

        this.showInfo.next_episode_number=res.next_episode_to_air.episode_number;

        this.showInfo.next_episode_season=res.next_episode_to_air.season_number;
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


  // SETTING THE VALUE OF THE CAST PROPERTY

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

  subscribe() {

      this.userservice.subscribe(JSON.stringify(this.showInfo)).subscribe((res:any) => {

        console.log(res);

        this.notification.showSuccessMsg('Subscribed successfully');

        this.renderer.setProperty(this.actionbtn.nativeElement, 'innerHTML', '<i class="fa fa-check"></i>subscribed');
      })
  }


   // TOGGLING THE DISPLAY OF THE SIDEBAR

  toggleSideBar():boolean {

    this.is_sidebar_visible=this.interactions.toggleSideBarVisible(this.is_sidebar_visible, this.renderer, this.overlay.nativeElement);

    this.smallScreen=this.interactions.toggleSideBarSmall(this.smallScreen, this.overlay.nativeElement);

    return true;
  }


  // CLOSING THE SIDEBAR WHEN THE BODY IS CLICKED WHEN WE ARE ON A SMALL SCREEN

  closeSidebar() {

   this.smallScreen=this.interactions.closeSidebar(this.smallScreen, this.renderer, this.overlay.nativeElement);
  }


  // DETERMINING IF ANY NEXT EPISODE INFORMATION WILL BE DISPLAYED

  hasNextEpisode():boolean {

    if(this.next_episode !== null) {



      return true;
    }

    return false;
  }


  // TOGGLING THE DISPLAY OF THE DIV WITH THE NEXT EPISODE DATE WHEN YOU HOVER ON/OFF OF THE COUNTDOWN

  toggleDisplayDate() {

      // alert('leke');
  }

}
