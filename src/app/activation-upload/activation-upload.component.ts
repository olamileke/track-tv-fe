import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../auth.service';

import { catchError } from 'rxjs/operators';

import { Observable, of } from 'rxjs';

import { User } from '../user';

import { NotificationsService } from '../notifications.service';

@Component({
  selector: 'app-activation-upload',
  templateUrl: './activation-upload.component.html',
  styleUrls: ['./activation-upload.component.css']
})
export class ActivationUploadComponent implements OnInit {

  constructor(private route:ActivatedRoute, private auth:AuthService,
  			  private router:Router, private notification:NotificationsService) { }

  ngOnInit() {

  	const token=this.route.snapshot.paramMap.get('token');

  	// ACTIVATING THE USER

  	this.auth.activateAccount(token).pipe(

  		 	catchError(this.handleError<User[]>([]))
  		).subscribe((res:User[]) => { 

  			this.auth.setUserData(res[0], false);

  			// REDIRECTING THE USER TO THE LOGGED IN HOME PAGE IF THE ACCOUNT IS ACTIVATED SUCCESSFULLY

  			this.router.navigate(['/']);

  			this.notification.showSuccessMsg('Account activated successfully');

  		 })
  }


  // ERROR HANDLER FOR IF ACTIVATING THE USER FAILS

  handleError<T>(result){

     return (error:any):Observable<T> => {

     	console.log(error);

     	if(error.status == 404)
     	{
     		this.router.navigate(['/signup']);

     		this.notification.showInfoMsg('Invalid token');
     	}

     	return of(result as T);
     }
  }

}
