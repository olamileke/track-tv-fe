import { Component, OnInit, Output, HostListener, ElementRef, Renderer2, EventEmitter } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { of, throwError } from 'rxjs';

import { Router } from '@angular/router';

import { AuthService } from '../auth.service';

import { catchError  } from 'rxjs/operators';

import { ConfigService } from '../config.service';

import { NotificationsService } from '../notifications.service';

import { UserService } from '../user.service';

import { TvService } from '../tv.service';

import { TvShow } from '../tv-show';

@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.css']
})
export class SubscriptionsComponent implements OnInit {

  // METHOD SETTING THE APPROPRIATE STYLING WHEN THE SIDEBAR BECOMES FIXED

  @HostListener('window:scroll', ['$event'])
  scrollHandler() {

  	this.config.scrollHandler(this.renderer, this.elRef); 
  }

  TvShows:TvShow[]=[];

  hasSubscriptions:boolean;

  displayUnsubscribeDialog:boolean=false;

  displayViewInfo:boolean=false;

  @Output() toggleOverlay=new EventEmitter();

  load:boolean=true;

  unsubscribe_loader:boolean=false;

  details={};

  subscribedInfo=[];

  currentlyViewedInfo={};

  below_450px:boolean=false;

  timestamps;

  constructor(private elRef:ElementRef, private renderer:Renderer2, private auth:AuthService,
              private config:ConfigService, private http:HttpClient, private router:Router,
              private tv:TvService, private userservice:UserService, private notification:NotificationsService) { }

  ngOnInit() {

    this.config.scrollHandler(this.renderer, this.elRef);  


    if(screen.width <= 450) {

      this.below_450px=true;
    }


    // INTERVAL TO CHECK IF THERE WAS A PROBLEM FETCHING TV DATA AND REMOVING THE LOADER IF THERE IS AN ERROR

    const interval=setInterval(() => 
    {
        if(this.tv.errorsubscription) {

            this.load=false;

            this.hasSubscriptions=true;

            clearInterval(interval);
        }

    }, 500)

    // CHECKING IF THE USER HAS TV SHOWS HE HAS SUBSCRIBED TO 
    // IF HE DOES HAVE TV SHOWS THAT HE HAS SUBSCRIBED TO , I AM THEN MAKING THE CALL
    // TO THE API TO FETCH THAT PARTICULAR TV SHOWS
    // IF HE DOES NOT HAVE ANY SUBSCRIBED TO TV SERIES, DISPLAY A MESSAGE

    const URL=`http://localhost:8000/api/getsubscriptions?api_token=${this.config.apiToken}`;

     if(this.tv.subscribedTvShows.length == 0) {

       this.http.get(URL).pipe(catchError(this.tv.handleError('subscription'))).subscribe((res:any) => {

             if(res.length > 0) {

               this.subscribedInfo=res;

               this.userservice.subscribedInfo=res;

               this.hasSubscriptions=true;

               for(let i=0; i < res.length; i++) {

                   // MAKING THE CALL TO THE API FOR DETAILS ABOUT THE PARTICULAR TV SHOW

                   this.tv.getShowDetail(parseInt(res[i].show_id)).subscribe((res:any) => {

                        this.setTvShows(res, i);
                   })


               }

               this.load=false;

               clearInterval(interval);

             } 
             else {

               this.hasSubscriptions=false;

               this.load=false;

               clearInterval(interval);               

             }

         });

     }
     else {

         this.TvShows=this.tv.subscribedTvShows;

         this.subscribedInfo=this.userservice.subscribedInfo;

         this.hasSubscriptions=true;

         this.load=false;
     }


  }


   // SETTING THE FETCHED TV SHOW DATA INTO THE TV SHOWS ARRAY

  setTvShows(res:any, i:number) {

     this.tv.getShowDetail(res.id).subscribe((res:any) => { 

         if(!this.below_450px) {

              var tvshow=new TvShow(res.id, res.name,res.overview,
              `http://image.tmdb.org/t/p/w1280${res.poster_path}`,
               this.tv.getAirDateString(res.first_air_date),
               res.vote_average, this.tv.constructGenresString(res.genres),
                res.in_production,'');
          }
          else {

              var tvshow=new TvShow(res.id, res.name,res.overview,
              `http://image.tmdb.org/t/p/w1280${res.backdrop_path}`,
               this.tv.getAirDateString(res.first_air_date),
               res.vote_average, this.tv.constructGenresString(res.genres),
                res.in_production,'');
          }

          this.TvShows.push(tvshow);

          this.tv.subscribedTvShows.push(tvshow);

       })          
  }


  // VIEWING DETAILS ABOUT THE SUBSCRIBED TO TV SHOWS

  viewInfo(details:any) {

    this.displayViewInfo=true;

    this.toggleOverlay.emit(true);

     for(let i=0; i < this.subscribedInfo.length; i++) {

        if(parseInt(details.id) == this.subscribedInfo[i].show_id) {

            this.currentlyViewedInfo=this.subscribedInfo[i];

            this.currentlyViewedInfo['id']=parseInt(details.id);

            this.currentlyViewedInfo['slug']=details.name;

            break;
        }
     }
  }


  // CLOSING THE VIEW NEXT EPISODE DIALOG

  closeInfoDialog() {

    this.displayViewInfo=false;

    this.toggleOverlay.emit(false);
  }


  // OPENING THE UNSUBSCRIBE DIALOG

  triggerUnSubscribeDialog(event:any):void {

      this.toggleOverlay.emit(true);

      this.displayUnsubscribeDialog=true;

      this.details=event;
  }


  // CLOSING THE UNSUBSCRIBE DIALOG

  closeDialog() {

     this.toggleOverlay.emit(false);

     this.displayUnsubscribeDialog=false;
  }


  // DELETING THE TV SHOW FROM THE DOM AFTER THE USER HAS UNSUBSCRIBED FROM IT

  removeTvShow(id:number) {

    for(let i=0; i < this.TvShows.length; i++) {

      if(this.TvShows[i].id == id) {

        this.TvShows.splice(i ,1);

        break;
      }
    }

  }


  // UNSUBSCRIBE FROM A TV SHOW

  unsubscribe(id:any) {

     this.displayUnsubscribeDialog=false;

     this.unsubscribe_loader=true;

     this.userservice.unsubscribe(parseInt(id)).pipe(catchError(this.handleError())).subscribe((res:any) => {

         this.toggleOverlay.emit(false);

         this.unsubscribe_loader=false;

         this.userservice.deleteSubscriptionID(parseInt(id));

         this.removeTvShow(parseInt(id));

         this.notification.showSuccessMsg('Successfully unsubscribed');

     })
  }


  handleError() {

    return (error:any) => {

      if(error.status == 401) {

        this.router.navigate(['/login']);

        this.auth.unSetUserData();

        this.notification.showInfoMsg('Access Denied');
      }
      else {

        this.notification.showErrorMsg('There was a problem processing the request', 'Error');

      }

      this.toggleOverlay.emit(false);

      this.unsubscribe_loader=false;

      return throwError(error);
    }
  }
}
