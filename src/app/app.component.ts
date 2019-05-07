import { Component, OnInit } from '@angular/core';

import { UserService } from './user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'TrackTv';

  constructor(private userservice:UserService){}

  ngOnInit(){ 

  	this.userservice.getSubsribedIDs().subscribe((res:any) => {

  		this.userservice.subscribedIDs=res[0];
  	})

  }

 }
