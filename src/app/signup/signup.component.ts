import { Component, OnInit, ViewChild, Renderer2 } from '@angular/core';

import { User } from '../user';

import { NotificationsService } from '../notifications.service';

import { UserService } from '../user.service';

import { throwError } from 'rxjs';

import { catchError , tap } from'rxjs/operators';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html', 
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  @ViewChild('eye') showPasswordEye;

  @ViewChild('passwordinput') passwordinput;

  @ViewChild('signupbtn') signupbtn;

  loading:boolean=false;

  count:number=0;

  password_invalid:boolean=false;

  constructor(private renderer:Renderer2, private userservice:UserService, private notification:NotificationsService) { }

  ngOnInit() {
  }

  user=new User('', '', '');

  // DETERMINING IF THE EYE IS TO BE DISPLAYED OR NOT

  displayShowButton(val:string):boolean {

    if(val.length >= 8) {

      this.password_invalid=true;
    }
    else {

      this.password_invalid=false;
    }

  	if(val.length > 0)
  	{
  		this.renderer.addClass(this.showPasswordEye.nativeElement, 'show');
  		return true;
  	}

  	this.renderer.removeClass(this.showPasswordEye.nativeElement, 'show');
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

  // SUBMITTING THE FORM TO THE BACKEND

  onSubmit():void{

    this.renderer.setProperty(this.signupbtn.nativeElement, "disabled", true);

    this.loading=true;

    this.userservice.signup(JSON.stringify(this.user)).pipe(catchError(this.handleError())) .subscribe((res:User[]) => {
                            
        this.loading=false;
        this.notification.showSuccessMsg('Please check your email', 'Registration successful');   
     });
  }


  // ERROR HANDLER IF REGISTRATION FAILS

  handleError<T>( result?:T){

      return (error:any) => {

        console.log(error);

        if(error.status == 0)
        {
           this.notification.showErrorMsg('There was a problem processing the request', 'Error');

           this.loading=false;

           this.renderer.setProperty(this.signupbtn.nativeElement, "disabled", false);
        }

        return throwError(result as T);
      }
  }


}
