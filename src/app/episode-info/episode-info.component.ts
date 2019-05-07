import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-episode-info',
  templateUrl: './episode-info.component.html',
  styleUrls: ['./episode-info.component.css']
})
export class EpisodeInfoComponent implements OnInit {

  @Input() episode;

  constructor() { }

  ngOnInit() {
  }


  // RETURNING THE EXACT DAY THE EPISODE WILL BE RELEASED AS A STRINF 

  getDateString(date):string{

  	const monthArray=['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October','November','December'];

  	const dayArray=['Sunday','Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  	const air_year=date.slice(0,4);

  	const air_month=date.slice(5,7);

  	const air_day=date.slice(8,10);

  	const air_exact_date=new Date(`${air_day} ${monthArray[air_month-1]} ${air_year}`).getDay();

  	let today=new Date();

  	let year=today.getFullYear();

  	let day=today.getDate();

  	let exactDay=today.getDay();

  	let month=today.getMonth() + 1;

  	if(parseInt(air_year) == year && parseInt(air_month) == month && parseInt(air_day) == day) {

  		return 'today';
  	}
  	else {

  		return `${dayArray[air_exact_date]}, ${air_day} ${monthArray[air_month-1]} ${air_year}`;
  	}
  }


  // CHECKING IF THE NEXT EPISODE HAS A STILL PATH

  hasImage():boolean{

  	if(this.episode.still_path == null) {

  		return false;
  	}

  	return true;
  }
}
