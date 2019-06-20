import { Component, OnInit, OnDestroy, Input, HostListener, Renderer2, ElementRef} from '@angular/core';

import { TvService } from '../tv.service';

import { interval, Subject } from 'rxjs';

import { TvShow } from '../tv-show';

import { takeUntil } from 'rxjs/operators';

import { ConfigService } from '../config.service';

@Component({
  selector: 'app-genre',
  templateUrl: './genre.component.html',
  styleUrls: ['./genre.component.css'],
})
export class GenreComponent implements OnInit, OnDestroy {
 
  @HostListener('window:scroll', ['$event'])
  scrollHandler() {

  	this.config.scrollHandler(this.renderer, this.elRef);
  }

  private onDestroy$:Subject<void>=new Subject<void>();

  @Input() genre:string;

  @Input() genreId:number;

  checkForChange=interval(2000);

  load:boolean=true;

  response:any;

  below_412px:boolean=false;

  TvShows:TvShow[]=[];

  constructor(private tv:TvService, private config:ConfigService, private elRef:ElementRef, private renderer:Renderer2) { 

  }

  ngOnInit() {

    this.config.scrollHandler(this.renderer, this.elRef);    

    if(screen.width <= 412) {

      this.below_412px=true;
    }

    // INTERVAL TO CHECK IF THERE WAS A PROBLEM FETCHING TV DATA AND REMOVING THE LOADER IF THERE IS AN ERROR

    const interval=setInterval(() => 
    {
        if(this.tv.errorgenre) {

            this.load=false;

            clearInterval(interval);

            this.tv.errorgenre=false;
        }

    }, 500)


     const page=this.getPageNumber();

  	 this.tv.getByGenre(this.genreId, 'genre',page).pipe(takeUntil(this.onDestroy$)).subscribe((res:any) => {

           this.response=res.results;

           for(let i=0; i < res.results.length; i++) {

              this.setTvShows(i);

              clearInterval(interval);
           }

           this.load=false;
  	 })

  }


  ngOnDestroy() {

      this.onDestroy$.next();
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

   // SETTING THE FETCHED TV SHOW DATA INTO THE TV SHOWS ARRAY

  setTvShows(i:number) {

     this.tv.getShowDetail(this.response[i].id).pipe(takeUntil(this.onDestroy$)).subscribe((res:any) => { 

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
