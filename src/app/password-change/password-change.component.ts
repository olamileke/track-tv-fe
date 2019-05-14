import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';

import { Router,ActivatedRoute } from '@angular/router';

import { AuthService } from '../auth.service';

import { of } from 'rxjs';

import { catchError } from 'rxjs/operators';

import { NotificationsService } from '../notifications.service';

@Component({
  selector: 'app-password-change',
  templateUrl: './password-change.component.html',
  styleUrls: ['./password-change.component.css']
})
export class PasswordChangeComponent implements OnInit {

	name:string;

	token:string

  @ViewChild('eye') showPasswordEye;

  @ViewChild('passwordinput') passwordinput;

  loading:boolean=false;

  disabled:boolean=false;

	user={'password':''};

  constructor(private auth:AuthService,private router:Router,
  					private activatedroute:ActivatedRoute, private notification:NotificationsService, private renderer:Renderer2) { }

  ngOnInit() {

  	this.token=this.activatedroute.snapshot.paramMap.get('token');

  	this.auth.checkPasswordResetToken(this.token).pipe( catchError(this.handleError())).subscribe((res:any) => {

  			this.name=res.data.split(' ')[1];
  	})

  }


  // ERROR HANDLER

  handleError() {

  	 return(error:any) => {

  	 	if(error.status == 404) {

  	 		this.router.navigate(['/password-reset']);

  	 		this.notification.showErrorMsg('Password Reset Token does not exist');
  	 	}

  	 	console.log(error);

  	 	return of(error);
  	 }
  }  


  // TOGGLING THE PASSWORD'S VISIBILITY

  toggleShowPassword(){

    if(this.showPasswordEye.nativeElement.classList.contains('fa-eye'))
    {
      this.renderer.removeClass(this.showPasswordEye.nativeElement, 'fa-eye');
      this.renderer.addClass(this.showPasswordEye.nativeElement, 'fa-eye-slash');
      this.renderer.setAttribute(this.passwordinput.nativeElement, 'type', 'text');
    }
    else
    {
      this.renderer.removeClass(this.showPasswordEye.nativeElement, 'fa-eye-slash');
      this.renderer.addClass(this.showPasswordEye.nativeElement, 'fa-eye');
      this.renderer.setAttribute(this.passwordinput.nativeElement, 'type', 'password');
    }

  }


  // DETERMINING IF THE TOGGLE EYE WILL BE DISPLAYED ON THE PASSWORD INPUT	

  checkPasswordLength():boolean {

  	if(this.passwordinput.nativeElement.value.length > 0) {

  		return true;
  	}

  	return false;
  }


  changePassword() {

  		this.loading=true;

  		this.auth.resetPassword(this.token, JSON.stringify(this.user)).pipe(catchError(this.handleError())).subscribe((res:any) => {

  			console.log(res);

  			this.router.navigate(['/login']);

  			this.loading=false;

  			this.disabled=true;

  			this.notification.showSuccessMsg('Password changed successfully');
  		})
  }

}
