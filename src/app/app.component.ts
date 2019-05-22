import { Component, OnInit } from '@angular/core';

import { throwError } from 'rxjs';

import { catchError } from 'rxjs/operators';

import { Router } from '@angular/router';

import { UserService } from './user.service';

import { AuthService } from './auth.service';

import { NotificationsService } from './notifications.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'TrackTv';

  constructor(private auth:AuthService, private userservice:UserService,
              private router:Router, private notification:NotificationsService){}

  ngOnInit() {

    if(this.auth.isAuthenticated()) {

      	this.userservice.getSubscribedIDs().subscribe((res:any) => {

      		this.userservice.subscribedIDs=res[0];
      	})

        this.userservice.getUser().pipe(catchError(this.handleError())).subscribe((res:any) => {})
     }
  }


  handleError() {

    return (error:any) => {

      if(error.status == 401) {

         this.router.navigate(['/login']);

         this.auth.unSetUserData();

         this.notification.showInfoMsg('Invalid Token', 'Access Denied');
      }

      return throwError(error);
    }
  }

 }
