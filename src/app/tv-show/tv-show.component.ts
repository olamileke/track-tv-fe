import { Component, OnInit, Input, ViewChild, Renderer2, ElementRef } from '@angular/core';

import { TvShow } from '../tv-show';

@Component({
  selector: 'app-tv-show',
  templateUrl: './tv-show.component.html',
  styleUrls: ['./tv-show.component.css', './tv-show-small.component.css']
})
export class TvShowComponent implements OnInit {

  @Input() TvShow:TvShow;

  @Input() showPopularity:boolean=false;

  @Input() subscription:boolean=false;

  below_412px:boolean=false;

  constructor(private renderer:Renderer2, private elRef:ElementRef) { }

  @ViewChild('tvshow') show;

  ngOnInit() { 

     if(screen.width <= 412) {

      this.below_412px=true;
    }

  }

  // OBTAINING THE SLUG TO DISPLAY IN THE URL FROM THE TV SHOW NAME

  getSlug(name:string):string {

    const slug=name.replace(/ /g, '-').toLowerCase();

    return slug;
  }

}
 