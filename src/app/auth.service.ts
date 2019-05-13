import { Injectable } from '@angular/core';

import { User } from './user';

import { Observable, of } from 'rxjs';

import { catchError } from 'rxjs/operators';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { ConfigService } from './config.service';

import { NotificationsService } from './notifications.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http:HttpClient, private config:ConfigService, private notification:NotificationsService) { }

  // DETERMINING IF THE USER IS AUTHENTICATED OR NOT VIA THE API TOKEN 
 
  isAuthenticated():boolean {

  	  if(sessionStorage.getItem('api_token') !== null && sessionStorage.getItem('api_token').length == 60)
  	  {
  	  	 return true;
  	  }

  	  if(localStorage.getItem('api_token') !== null && localStorage.getItem('api_token').length == 60)
  	  {
  	  	 return true; 
  	  }

  	  return false;
  }


   // SETTING THE API TOKEN AND DETAILS OF THE LOGGED IN USER

  setUserData(user:User, remember:boolean) {

     if(remember)
     {
     	  localStorage.profile=JSON.stringify(user);

        localStorage.api_token=user.api_token;

        localStorage.image=user.avatar;

        return true;
     }

     sessionStorage.profile=JSON.stringify(user);

     sessionStorage.api_token=user.api_token;

     sessionStorage.profileImage=user.avatar;

     return true;
  }


  // UNSETTING THE API TOKEN AND DETAILS OF THE LOGGED IN USER

  unSetUserData():boolean {

    if(sessionStorage.profile !== null) {

      sessionStorage.profile='';

      sessionStorage.api_token='';

      sessionStorage.image='';

      return true;
    }

    localStorage.profile='';

    localStorage.api_token='';

    localStorage.image='';

  }

  // ACTIVATING THE USER

  activateAccount(token:string):Observable<User[]> {

    const URL=this.config.baseURL+`/api/account/activate/${token}`;

    return this.http.post<User[]>(URL, this.headers);
  }


  sendPasswordResetMail(data:any) {

    const URL=this.config.baseURL+'/api/sendresetmail';

    return this.http.post(URL, data, this.headers);
  }


  checkPasswordResetToken(token:string) {

    const URL=this.config.baseURL+`/api/checkresettoken/${token}`;

    return this.http.post(URL,this.headers);
  }


  resetPassword(token:string, data:any) {

    const URL=this.config.baseURL+`/api/resetpassword/${token}`;

    return this.http.post(URL, data, this.headers);
  }


  // LOGGING THE USER OUT

  logout():Observable<any> {

    const URL=this.config.baseURL+'/api/logout?api_token='+this.config.apiToken;

    return this.http.post(URL, this.headers).pipe(catchError(this.handleError()));

  }

  // ERROR HANDLER

  handleError() {

     return (error:any):Observable<any> => {

      console.log(error);

      if(error.status == 500) {

        this.notification.showErrorMsg('Internal Server Error', '500');
      }

      return of(error);
    }
  }


  get headers()
  {
     const headers={headers:new HttpHeaders({'Accepts':'application/json', 'Content-Type':'application/json'})};

     return headers;
  }
}
