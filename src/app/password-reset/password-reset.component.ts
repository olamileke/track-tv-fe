import { Component, OnInit } from '@angular/core';

import { AuthService } from '../auth.service';

import { throwError } from 'rxjs';

import { catchError } from 'rxjs/operators';

import { NotificationsService } from '../notifications.service';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css']
})
export class PasswordResetComponent implements OnInit {

  constructor(private auth:AuthService, private notification:NotificationsService) { }

  ngOnInit() {
  }

  loading:boolean=false;

  btndisabled:boolean=false;

  user={'email':''};

  submit() {

  	this.loading=true;

  	this.auth.sendPasswordResetMail(JSON.stringify(this.user)).pipe(catchError(this.handleError())).subscribe((res:any) => {

  		this.notification.showSuccessMsg('Check your email to continue the Password Reset process');

  		this.btndisabled=true;

  		this.loading=false;
  	})

  }


  // ERROR HANDLER 

  handleError() {

  	return (error:any) => {

      if(error.status == 0) {

        this.notification.showErrorMsg('There was a problem processing the request', 'Error');
      }

  		if(error.status == 404) {

  			this.notification.showErrorMsg('No user exists for that email address');
  		}

      this.loading=false;

  		return throwError(error);
  	}
  }

}
