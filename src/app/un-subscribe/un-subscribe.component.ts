import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-un-subscribe',
  templateUrl: './un-subscribe.component.html',
  styleUrls: ['./un-subscribe.component.css']
})
export class UnSubscribeComponent implements OnInit {

  @Input() details;

  constructor() { }

  ngOnInit() {
  }

}
