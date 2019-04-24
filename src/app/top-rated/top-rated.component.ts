import { Component, OnInit, HostListener, ElementRef, Renderer2 } from '@angular/core';

import { TvShow } from '../tv-show';

import { TvService } from '../tv.service';

import { Observable } from 'rxjs';

import { ConfigService } from '../config.service';

@Component({
  selector: 'app-top-rated',
  templateUrl: './top-rated.component.html',
  styleUrls: ['./top-rated.component.css']
})
export class TopRatedComponent implements OnInit {

  // SETTING THE APPROPRIATE STYLING WHEN THE SIDEBAR BECOMES FIXED 

  @HostListener('window:scroll', ['$event'])
  scrollHandler() {

    this.config.scrollHandler(this.renderer, this.elRef);
  }


  TvShows:TvShow[]=[];

  load:boolean=true;

  response:any;

  below_412px:boolean=false;

  constructor(private tv:TvService, private renderer:Renderer2, private elRef:ElementRef, private config:ConfigService) { }

  ngOnInit() {

    this.config.scrollHandler(this.renderer, this.elRef);    

    // INTERVAL TO CHECK IF THERE WAS A PROBLEM FETCHING TV DATA AND REMOVING THE LOADER IF THERE IS AN ERROR

    const interval=setInterval(() => 
    {
        if(this.tv.errortoprated) {

            this.load=false;

            clearInterval(interval);
        }

    }, 500)

     if(screen.width <= 412) {

      this.below_412px=true;
    }

    // ESSENTIALLY WHAT I AM DOING HERE IS THAT THE FIRST TIME THIS COMPONENT IS CREATED
    // IT MAKES THE CALL TO THE API TO FETCH THE TOP RATED TV SHOWS
    // AFTER FETCHING IT I AM STORING THE TV SHOWS IN THE SERVICE SO THAT IF
    // THE COMPONENT IS LOADED AGAIN IT DOESNT HAVE TO MAKE ANOTHER REQUEST TO THE API
    // ALL IT HAS TO DO IS TO FETCH IT FROM THE SERVICE

    if(this.tv.returnTopRatedShows.length == 0) {

    	this.tv.getTopRatedShows('toprated').subscribe((res:any) => {

           console.log(res.results);

           this.response=res.results;

           for(let i=0; i < res.results.length; i++) {

              this.setTvShows(i);

           }

           this.tv.topRatedShows=this.TvShows;

           this.load=false;

           clearInterval(interval);

    	})

     }
     else {

       this.TvShows=this.tv.returnTopRatedShows;

       this.load=false;

       clearInterval(interval);
     }
  }

  // SETTING THE FETCHED TV SHOW DATA INTO THE TV SHOWS ARRAY

  setTvShows(i:number) {

     this.tv.getShowDetail(this.response[i].id).subscribe((res:any) => { 

           if(!this.below_412px) {

              var tvshow=new TvShow(this.response[i].id, this.response[i].name,this.response[i].overview,
            `http://image.tmdb.org/t/p/w1280${this.response[i].poster_path}`,
             this.tv.getAirDateString(this.response[i].first_air_date),
             this.response[i].vote_average, this.tv.constructGenresString(res.genres),
              res.in_production,'');
           }
           else {

             var tvshow=new TvShow(this.response[i].id, this.response[i].name,this.response[i].overview,
            `http://image.tmdb.org/t/p/w1280${this.response[i].backdrop_path}`,
             this.tv.getAirDateString(this.response[i].first_air_date),
             this.response[i].vote_average, this.tv.constructGenresString(res.genres),
              res.in_production,'');

           }

         
          this.TvShows.push(tvshow);
       })          
  }

}
  