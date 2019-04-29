import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-similar-show',
  templateUrl: './similar-show.component.html',
  styleUrls: ['./similar-show.component.css']
})
export class SimilarShowComponent implements OnInit {

  @Input() TvShow;

  constructor() { }

  ngOnInit() {
  }

  // OBTAINING THE SLUG TO DISPLAY IN THE URL FROM THE TV SHOW NAME

  getSlug(name:string):string {

    const slug=name.replace(/ /g, '-').toLowerCase();

    return slug;
  }
}
