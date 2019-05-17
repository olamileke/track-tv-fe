import { Component, OnInit, HostListener, ElementRef, Renderer2} from '@angular/core';

import { TvService } from '../tv.service';

import { TvShow } from '../tv-show';

import { Observable } from 'rxjs';

import { ConfigService } from '../config.service';

@Component({
  selector: 'app-popular',
  templateUrl: './popular.component.html',
  styleUrls: ['./popular.component.css']
}) 
export class PopularComponent implements OnInit {

  // SETTING THE APPROPRIATE STYLING WHEN THE SIDEBAR BECOMES FIXED 

  @HostListener('window:scroll', ['$event'])
  scrollHandler() {

    this.config.scrollHandler(this.renderer, this.elRef);
  }
  
  TvShows:TvShow[]=[]; 

  load:boolean=true;

  below_412px:boolean=false;

  response:any;

  constructor(private tv:TvService, private elRef:ElementRef, private renderer:Renderer2, private config:ConfigService) { }

  ngOnInit() { 


    if(screen.width <= 412) {

      this.below_412px=true;
    }

    this.config.scrollHandler(this.renderer, this.elRef);
    
    // INTERVAL TO CHECK IF THERE WAS A PROBLEM FETCHING TV DATA AND REMOVING THE LOADER IF THERE IS AN ERROR

    const interval=setInterval(() => 
    {
        if(this.tv.errorpopular) {

            this.load=false;

            clearInterval(interval);
        }

    }, 500)


    // ESSENTIALLY WHAT I AM DOING HERE IS THAT THE FIRST TIME THIS COMPONENT IS CREATED
    // IT MAKES THE CALL TO THE API TO FETCH THE POPULAR TV SHOWS
    // AFTER FETCHING IT I AM STORING THE TV SHOWS IN THE SERVICE SO THAT IF
    // THE COMPONENT IS LOADED AGAIN IT DOESNT HAVE TO MAKE ANOTHER REQUEST TO THE API
    // ALL IT HAS TO DO IS TO FETCH IT FROM THE SERVICE

    if(this.tv.returnPopularShows.length == 0) {

      const page=this.getPageNumber();

    	this.tv.getPopularShows('popular', page).subscribe((res:any) => {

    					this.response=res.results;

    					for(let i=0; i < res.results.length; i++) {

                  this.setTvShows(i);                			
    					}

              this.tv.popularShows=this.TvShows;

              this.load=false;

              clearInterval(interval);

  			  	});

      }
      else {

        this.TvShows=this.tv.returnPopularShows;

        this.load=false;

        clearInterval(interval);

      }
  }


  // RETURNING THE PAGE OF THE RESULTS TO DISPLAY TO THE USER

  getPageNumber():number {

     let number=Math.round(Math.random() * 20);

     if(number == 0) {

       return 1;
     }

     if(number == 20) {

       return 19;
     }

     return number;
  }


  // SETTING THE FETCHED TV SHOWS DATA IN THE TV SHOWS ARRAY

  setTvShows(i:number) {

    this.tv.getShowDetail(this.response[i].id).subscribe((res:any) => { 

          if(!this.below_412px) {

              var tvshow=new TvShow(this.response[i].id, this.response[i].name,
              this.response[i].overview,
            `http://image.tmdb.org/t/p/w1280${this.response[i].poster_path}`,
             this.tv.getAirDateString(this.response[i].first_air_date),
            this.response[i].vote_average, this.tv.constructGenresString(res.genres),
             res.in_production, this.response[i].popularity);

           }
           else {

             var tvshow=new TvShow(this.response[i].id, this.response[i].name,
              this.response[i].overview,
            `http://image.tmdb.org/t/p/w1280${this.response[i].backdrop_path}`,
             this.tv.getAirDateString(this.response[i].first_air_date),
            this.response[i].vote_average, this.tv.constructGenresString(res.genres),
             res.in_production, this.response[i].popularity);

           }

          this.TvShows.push(tvshow);
       })          
  }


}
