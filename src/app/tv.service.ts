import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';

import { catchError } from 'rxjs/operators';

import { ConfigService } from './config.service';

import { NotificationsService } from './notifications.service'; 

import { TvShow } from './tv-show'; 

@Injectable({
  providedIn: 'root' 
})
export class TvService {

  load:boolean=true;

  subscribedTvShows:TvShow[]=[];

  popularTvShows:TvShow[]=[]; 

  topRatedTvShows:TvShow[]=[];

  exploreTvShows:TvShow[]=[];

  errorsubscription:boolean=false;

  errorpopular:boolean=false;

  errortoprated:boolean=false;

  errorexplore:boolean=false;

  errorgenre:boolean=false;

  constructor(private http:HttpClient, private config:ConfigService,private notification:NotificationsService) {}

  // FETCHING THE DETAILS OF A PARTICULAR TV SERIES

  getShowDetail(id:number, append?:boolean):Observable<any> {

    let URL=`https://api.themoviedb.org/3/tv/${id}?api_key=${this.config.apiKey}`;

    if(append) {

      URL=`https://api.themoviedb.org/3/tv/${id}?api_key=${this.config.apiKey}&append_to_response=similar,credits`;
    }

    return this.http.get(URL);

  }

  // CREATING THE GENRES STRING 

  constructGenresString(genres):any {

    const genresarray=[];

    if(genres !== undefined) {

      if(genres.length >= 2) {

        for(let i=0 ; i < 2; i++) {

            genresarray.push(genres[i].name);
         }

         return genresarray;
      }

      genresarray.push(genres[0].name);

      return genresarray;
     }
  }


  // METHODS RELATED TO THE POPULAR TV SERIES
 
  // FETCHING THE POPULAR TV SERIES

  getPopularShows(tab:string, page:number):Observable<any> {

  	const URL=`https://api.themoviedb.org/3/tv/popular?api_key=${this.config.apiKey}&page=${page}`;

  	return this.http.get(URL).pipe(catchError(this.handleError(tab)));
  }


  // SETTING THE POPULAR TV SHOWS PROPERTY

  set popularShows(TvShows:TvShow[]) {

    this.popularTvShows=TvShows;
  }

  // RETURNING THE POPULAR TV SHOWS PROPERTY

  get returnPopularShows(): TvShow[] {

     return this.popularTvShows;
  }


  // METHODS RELATED TO THE TOP RATED TV SHOWS


  // FETCHING THE TOP RATED TV SHOWS

  getTopRatedShows(tab:string):Observable<any> {

    const URL=`https://api.themoviedb.org/3/tv/top_rated?api_key=${this.config.apiKey}`;

    return this.http.get(URL).pipe(catchError(this.handleError(tab)));
  }


  // SETTING THE TOP RATED TV SHOWS 

  set topRatedShows(TvShows:TvShow[]) {

    this.topRatedTvShows=TvShows;
  }

  get returnTopRatedShows() :TvShow[] {

    return this.topRatedTvShows;
  }


  /// FETCHING TV SHOWS FILTERED ACCORDING TO GENRE

  getByGenre(id:number, tab:string, page:number):Observable<any> {

    const URL=`https://api.themoviedb.org/3/discover/tv?with_genres=${id}&page=${page}&api_key=${this.config.apiKey}`;

    return this.http.get(URL).pipe(catchError(this.handleError(tab)));

  }


  // MAKING THE CALL TO THE API TO FETCH SEARCH INFORMATION 

  fetchSearchResults(term:string):Observable<any> {

    const URL=`https://api.themoviedb.org/3/search/tv?query=${term}&api_key=${this.config.apiKey}`;

    return this.http.get(URL).pipe(catchError(this.handleError()));
  }


  // RETURNING THE PROPERLY FORMATTED AIR DATE

  getAirDateString(date:string) :string {

    let monthArray=['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    return `Began ${monthArray[Number(date.substr(5,2)) - 1]} ${date.substr(0,4)}`;
  }


  // METHODS RELATED TO THE EXPLORE TAB

  exploredTvShows(tab:string,rating:number, numvotes:number, genres): Observable<any> {

    const URL=`https://api.themoviedb.org/3/discover/tv?api_key=${this.config.apiKey}&
               vote_average.lte=${rating}&vote_count.lte=${numvotes}&with_genres=${genres[0], genres[1], genres[2], genres[3], genres[4], genres[5]}&
               page=${rating}`;


    return this.http.get(URL).pipe(catchError(this.handleError(tab)));          

  }


  // ERROR HANDLER FOR IF FETCHING THE TV DATA FAILS

  handleError(tab?:string) {

    return (error:any) => {

      if(error.status ==  0) {

          this.notification.showErrorMsg('There was a problem processing the request', 'Error');
      }

      if(error.status == 429) {

          this.notification.showErrorMsg('Wait a few seconds and try again', 'Request Timeout');
      }

      this.setErrorProperty(tab);

      return throwError(error);

    }
  }


  // SETTING THE PROPER ERROR PROPERTY TO KNOW WHICH COMPONENT FAILED TO FETCH DATA

  setErrorProperty(tab:string) {

    if(tab == 'subscription') {

      this.errorsubscription=true;
    }

    if(tab == 'popular') {

      this.errorpopular=true;
    }

    if(tab == 'explore') {

      this.errorexplore=true;
    }

    if(tab == 'toprated') {

      this.errortoprated=true;
    }

    if(tab == 'genre') {

      this.errorgenre=true;
    }
  }


  // RETURNING THE REQUIRED HTTPHEADERS

  get headers() {

    const headers={headers:new HttpHeaders({'Content-Type':'application/json'})};

    return headers;
  }

}
