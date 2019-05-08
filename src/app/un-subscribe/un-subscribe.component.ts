import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { UserService } from '../user.service';

@Component({
  selector: 'app-un-subscribe',
  templateUrl: './un-subscribe.component.html',
  styleUrls: ['./un-subscribe.component.css']
})
export class UnSubscribeComponent implements OnInit {

  @Input() details;

  @Output() close=new EventEmitter();

  @Output() unsubscribe=new EventEmitter();

  constructor(private userservice:UserService) { }

  ngOnInit() {
  }

  // EMITTING THE EVENT TO CLOSE THE UNSUBSCRIBE DIALOG

  emitCloseEvent():void{

  	this.close.emit();
  }


  // EMITTING THE EVENT TO UNSUBSCRIBE 

  emitUnsubscribeEvent() {

      this.unsubscribe.emit(this.details.id);
  }

}
