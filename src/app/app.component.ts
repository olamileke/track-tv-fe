import { Component, OnInit } from '@angular/core';

import { UserService } from './user.service';

import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'TrackTv';

  constructor(private auth:AuthService, private userservice:UserService){}

  ngOnInit(){ 


    if(this.auth.isAuthenticated()) {

      	this.userservice.getSubscribedIDs().subscribe((res:any) => {

      		this.userservice.subscribedIDs=res[0];
      	})

     }

  }

 }
