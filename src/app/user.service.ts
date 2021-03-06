import { Injectable } from '@angular/core';

import { User } from './user';

import { HttpClient, HttpHeaders, HttpEvent, HttpEventType, HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';

import { ConfigService } from './config.service';

import { NotificationsService } from './notifications.service'; 

import { map, catchError } from 'rxjs/operators';

import { TvService } from './tv.service';

@Injectable({
  providedIn: 'root'
})

export class UserService {

  errorupload:boolean=false;

  subscribedIDs=[];

  subscribedInfo=[];

  constructor(private http:HttpClient, private config:ConfigService, 
              private notification:NotificationsService, private tv:TvService) { }

  // RETURNING THE CURRENTLY LOGGED IN USER OBJECT

  getUser() {

    const URL=`${this.config.baseURL}/api/user?api_token=${this.config.apiToken}`;

    return this.http.get(URL);

  }

  // POSTING THE DATA TO THE BACKEND FOR SIGNUP

  signup(data):Observable<User[]> {

  	const URL=this.config.baseURL+"/api/register";

  	return this.http.post<User[]>(URL, data, this.headers);
  }


  // POSTING THE DATA TO THE BACKEND FOR LIGN

  login(data):Observable<User[]>{

    const URL=this.config.baseURL+"/api/login";

  	return this.http.post<User[]>(URL, data, this.headers);
  }

  // SUBSCRIBING TO A TV SHOW  

  subscribe(data:any) {

    const URL=this.config.baseURL+"/api/subscribe?api_token="+this.config.apiToken;

    return this.http.post<any>(URL, data, this.headers);

  } 


  // UNSUBSCRIBING FROM A TV SHOW

  unsubscribe(id:number) {

    const URL=`${this.config.baseURL}/api/unsubscribe/${id}?api_token=${this.config.apiToken}`;

    return this.http.post<any>(URL,this.headers);
  }


  // RETURN THE IDS OF THE TV SHOWS THAT THE USER HAS SUBSCRIBED TO

  getSubscribedIDs(){

    const URL=this.config.baseURL+"/api/getsubscribedids?api_token="+this.config.apiToken;

    return this.http.get(URL);
  }


  // DELETING THE ID OF THE TV SHOW AFTER THE USER UNSUBSCRIBES

  deleteSubscriptionID(id:number) {

    for(let i=0; i < this.subscribedIDs.length; i++) {

      if(this.subscribedIDs[i] == id) {

        this.subscribedIDs.splice(i ,1);

        break;
      }
    }

    this.deleteSubscriptionObject(id);
  }


  // DELETING THE TV SHOW OBJECT FROM THE SUBSCRIPTIONS OBJECT

  deleteSubscriptionObject(id:number) {

    for(let i=0; i < this.tv.subscribedTvShows.length; i++) {

       if(this.tv.subscribedTvShows[i].id == id) {

         this.tv.subscribedTvShows.splice(i,1);

         break;
       }
    }

  }


  // CHECKING IF THE USER HAS SUBSCRIBED TO A TV SHOW

  hasSubscribed(id:number) {

     const URL=this.config.baseURL+`/api/hassubscribed/${id}?api_token=`+this.config.apiToken;

     return this.http.post(URL, this.headers).pipe(catchError(this.handleError()));
  }                                      


  // RETURNING THE PROPER HTTP HEADERS TO USE FOR THE POST REQUEST

  get headers() {

    const httpOptions={headers:new HttpHeaders({'Content-Type':'application/json'})};

    return httpOptions;
  }


  uploadImage(formData:FormData) {

    const URL=this.config.baseURL+'/api/user/image/upload?api_token='+this.config.apiToken;

    return this.http.post(URL, formData).pipe(catchError(this.handleError()))
  }    


  // ERROR HANDLER FOR API CALLS TO THE BACKEND  

   handleError() {  

      return (error:any):any => {

        this.errorupload=true;

        if(error.status == 413) {

          this.notification.showErrorMsg('The uploaded image is too large');
        }

        else if(error.status == 406) {

          this.notification.showErrorMsg('File format is not supported');
        }

        else {

          this.notification.showErrorMsg('There was a problem processing your request', 'Error');
        }

        return throwError(error);
      }
    }


}
