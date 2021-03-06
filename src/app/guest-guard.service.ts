import { Injectable } from '@angular/core';

import { AuthService } from './auth.service';

import { NotificationsService } from './notifications.service';

import { CanActivate, Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class GuestGuardService implements CanActivate{

  constructor(private authservice:AuthService, private notification:NotificationsService, private router:Router) { }


  // DETERMINING IF THE USER IS AUTHENTICATED OR NOT AND IF HE IS PREVENTING ACCESS TO THE ROUTE

  canActivate():boolean {

  	if(!this.authservice.isAuthenticated())
  	{
  		return true;
  	}
  	
  	this.notification.showInfoMsg('Access Denied');

    this.router.navigate(['/subscriptions']);

  	return false;
  }	

}
