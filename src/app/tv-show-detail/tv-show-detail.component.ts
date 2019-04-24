import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tv-show-detail',
  templateUrl: './tv-show-detail.component.html',
  styleUrls: ['./tv-show-detail.component.css']
})
export class TvShowDetailComponent implements OnInit {

  constructor(private route:ActivatedRoute) { }

  ngOnInit() {

  	const id=this.route.snapshot.paramMap.get('id');

  	const name=this.route.snapshot.paramMap.get('name');

  	alert(id + ' ' + name);
  }

}
