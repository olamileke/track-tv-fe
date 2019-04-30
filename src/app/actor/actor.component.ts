import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-actor',
  templateUrl: './actor.component.html',
  styleUrls: ['./actor.component.css']
})
export class ActorComponent implements OnInit {

  @Input() actor;

  constructor() { }

  ngOnInit() {
  }


  getString(name:string):string {

  	if(name.length > 18) {

  		return name.slice(0,14) + '...';
  	}

  	return name;
  }

}
