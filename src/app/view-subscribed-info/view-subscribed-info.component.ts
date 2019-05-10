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

  	 if(overview !== null && overview.length > 300) {

  	 	this.displayReadMore=true;

  	 	this.summary=overview.slice(0,150) + '...';

  	 	return true;
  	 }	

  	 this.summary=overview;
  }


  emitCloseEvent() {

  	this.close.emit();
  }


  // CALCULATING THE TIME FROM WHEN THE USER SUBSCRIBED TO THE PARTICULAR TV SHOW

  getTimeFromSubscribed(time:string):string {

      let now=new Date().getTime();

      let date=new Date(time).getTime();

      let difference=now - date;

      if(difference > 86400000) {

          return this.getDayString(difference);
      }

      if(difference > 3600000) {

          return this.getHourString(difference)
      }

      if(difference > 60000) {

          return this.getMinuteString(difference);
      }
      
      return this.getSecondString(difference)

  }


  getDayString(difference:number):string {

    let num=Math.round(difference/86400000);

    if(num > 1) {

      return `${num} days ago`;
    }

    return `${num} day ago`
  }


  getHourString(difference:number):string {

    let num=Math.round(difference/3600000);

    if(num > 1) {

      return `${num} hours ago`;
    }

    return `${num} hour ago`
  }


  getMinuteString(difference:number):string {

    let num=Math.round(difference/60000);

    if(num > 1) {

      return `${num} minutes ago`;
    }

    return `${num} minute ago`;
  }


  getSecondString(difference:number):string {

    let num=Math.round(difference/1000);

    if(num > 1) {

      return `${num} seconds ago`;
    }

    return `${num} second ago`;
  }

}
