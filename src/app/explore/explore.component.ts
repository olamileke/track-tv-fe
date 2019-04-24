import { Component, OnInit, HostListener, Renderer2, ElementRef } from '@angular/core';

import { ConfigService } from '../config.service';

import { TvService } from '../tv.service';

import { TvShow } from '../tv-show';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.css']
})
export class ExploreComponent implements OnInit {

  @HostListener('window:scroll',['$event'])
  scrollHandler() {
  	this.config.scrollHandler(this.renderer, this.elRef);
  }

  genres=[10759, 16, 35, 80, 99, 18, 10751, 10762, 9648, 10763, 10764, 10765, 10766, 10767, 10768, 37];

  TvShows:TvShow[]=[];

  response:any;

  load:boolean=true;

  below_412px=false; 

  constructor(private renderer:Renderer2, private elRef:ElementRef, private config:ConfigService, private tv:TvService) { }

  ngOnInit() {

    this.config.scrollHandler(this.renderer, this.elRef);    

    // REQUIRED PARAMETER DATA TO SEND TO THE SERVICE TO FETCH THE EXPLORED TV SHOWS

    const rating=Math.round((Math.random() * 10));

    const numvotes=Math.round(Math.random() * 2000);

    const genreIDs=this.fetchGenreIDs();

    // INTERVAL TO CHECK IF THERE WAS A PROBLEM FETCHING TV DATA AND REMOVING THE LOADER IF THERE IS AN ERROR

    const interval=setInterval(() => 
    {
        if(this.tv.errorexplore) {

            this.load=false;

            clearInterval(interval);
        }

    }, 500)

    if(screen.width <= 412) {

      this.below_412px=true;
    }

     // ESSENTIALLY WHAT I AM DOING HERE IS THAT THE FIRST TIME THIS COMPONENT IS CREATED
    // IT MAKES THE CALL TO THE API TO FETCH THE EXPLORED TV SHOWS
    // AFTER FETCHING IT I AM STORING THE TV SHOWS IN THE SERVICE SO THAT IF
    // THE COMPONENT IS LOADED AGAIN IT DOESNT HAVE TO MAKE ANOTHER REQUEST TO THE API
    // ALL IT HAS TO DO IS TO FETCH IT FROM THE SERVICE

    if(this.tv.exploreTvShows.length == 0) {

      this.tv.exploredTvShows('explore',rating, numvotes, genreIDs).subscribe((res:any) => {

          console.log(res.results);

           this.response=res.results;

           for(let i=0; i < res.results.length; i++) {

              this.setTvShows(i);

           }

           this.tv.exploreTvShows=this.TvShows;

           this.load=false;

           clearInterval(interval);

      });

     }
     else {

       this.TvShows=this.tv.exploreTvShows

       this.load=false;

       clearInterval(interval);
     }

  }

  // DETERMINING THE GENRES WHOSE TV SHOWS WILL BE FETCHED

  fetchGenreIDs() {

    const subIDs=[];

    let i=0;

    while(i < 6) {

      let index=Math.round(Math.random() * this.genres.length);

      if(subIDs.indexOf(this.genres[index]) == -1){
          
        subIDs.push(this.genres[index]);

        i++;
      }

    }

    return subIDs;
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
