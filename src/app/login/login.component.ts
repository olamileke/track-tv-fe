import { Component, OnInit, OnDestroy, ViewChild, Renderer2 } from '@angular/core';

import { User } from '../user';

import { NotificationsService } from '../notifications.service';

import { UserService } from '../user.service';

import { AuthService } from '../auth.service'; 

import { Observable, Subject ,throwError, interval } from 'rxjs';

import { catchError, takeUntil } from 'rxjs/operators';

import { Router } from '@angular/router';

import { Images } from '../loginImages';
 
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  constructor(private notification:NotificationsService, private userservice:UserService,
             private renderer:Renderer2, private router:Router, private authservice:AuthService) { }

  loading:boolean=false;

  @ViewChild('loginbtn') loginbtn;

  @ViewChild('eye') showPasswordEye;

  @ViewChild('passwordinput') passwordinput;

  @ViewChild('overlay') overlay;

  private onDestroy$:Subject<void>=new Subject<void>();

  user=new User('', '', '');

  imgsrc:string;

  imageCounter=interval(45000);

  imageURLs=[];

  remember:boolean=true;

  ngOnInit() {

    // SETTING THE FIRST IMAGE TO BE DISPLAYED WHEN THE COMPONENT IS FIRST CREATED

    this.imgsrc=Images[Math.floor(Math.random() * Images.length)];

    this.imageURLs.push(this.imgsrc);

    this.imageCounter.pipe(takeUntil(this.onDestroy$)).subscribe(n => { 

        if(Images.length != this.imageURLs.length) {
          
          this.fadeImageIn()
        }

      } );
  }


  ngOnDestroy() {

    this.onDestroy$.next();
  }


  // FADING IN THE NEXT IMAGE AFTER 45 SECONDS

  fadeImageIn():boolean {

    const URL=Images[Math.floor(Math.random() * Images.length)];

    if(!this.imageOnPage(URL))
    {
        const img=this.renderer.createElement('img');

        this.renderer.appendChild(this.overlay.nativeElement, img);

        this.renderer.setProperty(img, 'src', URL);

        this.renderer.setProperty(img, 'opacity', 0);

        setTimeout( () => 
        {

          this.renderer.addClass(img, 'top');

        }, 1000)

        this.imageURLs.push(URL);

        return true;
    }

    this.fadeImageIn();

    return false;
  }


  // CHECKING IF AN IMAGE HAS BEEN DISPLAYED ALREADY

  imageOnPage(url:string):boolean {

      if(this.imageURLs.indexOf(url) == -1)
      {
        return false;
      }

      return true;
  }


  // POSTING THE DATA TO THE BACKEND FOR LOGIN

  onSubmit():void {
	
	this.loading=true;

  const remember=this.remember;

	this.renderer.setProperty(this.loginbtn.nativeElement, 'disabled', true);
	
	this.userservice.login(JSON.stringify(this.user)).pipe(catchError(this.handleError()), takeUntil(this.onDestroy$)).subscribe((res:User[]) => {	
		
			this.loading=false;

      this.router.navigate(['/subscriptions']);

      this.notification.showSuccessMsg('Login successful');  
      
      this.authservice.setUserData(res[0], remember); 	
	  })
  }

  // ERROR HANDLER

  handleError<T>(result?:T) {

  	return (error:any) : Observable<T> => {

  		if(error.status == 0)
  		{
  			this.notification.showErrorMsg('There was a problem processing the request', 'Error');  			
  		}

  		if(error.status == 401)
  		{
  			this.notification.showErrorMsg('Username or Password is incorrect');
  		}

  		if(error.status == 403)
  		{
  			this.notification.showErrorMsg('Please activate your account');
  		}

  		this.loading=false;

	  	this.renderer.setProperty(this.loginbtn.nativeElement, 'disabled', false);

  		return throwError(result as T);
  	}	
  }

   // DETERMINING IF THE EYE IS TO BE DISPLAYED OR NOT

  displayShowButton(val:string):boolean {

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


  // TOGGLE THE REMEMBER LOGIN

  toggleRemember() {
    
    this.remember=!this.remember;
  }


}
