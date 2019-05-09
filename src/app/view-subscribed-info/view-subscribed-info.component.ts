import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-view-subscribed-info',
  templateUrl: './view-subscribed-info.component.html',
  styleUrls: ['./view-subscribed-info.component.css']
})
export class ViewSubscribedInfoComponent implements OnInit {

  constructor() { }

  @Input() details;

  @Output() close=new EventEmitter();

  summary:string;

  displayReadMore:boolean=false;

  ngOnInit() {

  	this.setSummary(this.details.about_episode);
  }


  // RETURNING A SUMMARY OF THE NEXT EPISODE OF THE TV SHOW 

  setSummary(overview:string):boolean {

  	 if(overview.length > 300) {

  	 	this.displayReadMore=true;

  	 	this.summary=overview.slice(0,150) + '...';

  	 	return true;
  	 }	

  	 this.summary=overview;
  }


  emitCloseEvent() {

  	this.close.emit();
  }

}
