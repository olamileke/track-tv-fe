import { Injectable } from '@angular/core';

import { AuthService } from './auth.service';

import { Router, CanActivate } from '@angular/router';

import { NotificationsService } from './notifications.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate{

  constructor(private authservice:AuthService, private router:Router, private notification:NotificationsService) { }

  // DETERMINING IF THE USER IS AUTHENTICATED OR NOT AND IF HE IS NOT PREVENTING ACCESS TO THE ROUTE

  canActivate():boolean {

  	  if(this.authservice.isAuthenticated())
  	  {
  		  return true;
  	  }

  	  this.router.navigate(['/login']);

  	  this.notification.showInfoMsg('You have to be logged in', 'Access Denied');

  	  return false;
  }
}
