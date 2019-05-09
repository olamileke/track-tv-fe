import { Component, OnInit, Input, Output, ViewChild, Renderer2, ElementRef, EventEmitter } from '@angular/core';

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

  @Output() unsubscribe=new EventEmitter();

  @Output() viewInfo=new EventEmitter();

  details={};

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


  getShowName(name:string):string {

      if(name.length > 25) {

        return name.slice(0,23) + '...';
      }

      return name;
  }


  openUnSubscribeDialog():void {

    this.unsubscribe.emit(this.composeDetailsObject());
  }


  openViewInfoDialog():void {

    const details={'id':this.TvShow.id, 'name':this.getSlug(this.TvShow.name)};

    this.viewInfo.emit(details);
  }

  composeDetailsObject():any {

     this.details['imgpath']=this.TvShow.imgpath;

     this.details['name']=this.TvShow.name;

     this.details['id']=this.TvShow.id;

     return this.details;
  }

}
 