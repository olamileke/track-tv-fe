import { Component, OnInit, ViewChild, Renderer2 } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { HeaderComponent } from '../header/header.component';

import { InteractionsService } from '../interactions.service';

@Component({
  selector: 'app-tv-show-detail',
  templateUrl: './tv-show-detail.component.html',
  styleUrls: ['./tv-show-detail.component.css', '../css/overlay.css']
})
export class TvShowDetailComponent implements OnInit {

  @ViewChild('overlay') overlay; 

  @ViewChild('main') main; 

  constructor(private route:ActivatedRoute, private renderer:Renderer2, private interactions:InteractionsService) { }

  displayShadow:boolean=true;

  is_sidebar_visible:boolean=false;

  smallScreen:boolean=false;

  ngOnInit() {

  	const id=this.route.snapshot.paramMap.get('id');

  	const name=this.route.snapshot.paramMap.get('name');

  	if(screen.width <= 500) {

      this.is_sidebar_visible=true;
    }

  }

   // TOGGLING THE DISPLAY OF THE SIDEBAR

  toggleSideBar():boolean{

    this.is_sidebar_visible=this.interactions.toggleSideBarVisible(this.is_sidebar_visible, this.renderer, this.main.nativeElement);

    this.smallScreen=this.interactions.toggleSideBarSmall(this.smallScreen, this.overlay.nativeElement);

    return true;
  }


  // CLOSING THE SIDEBAR WHEN THE BODY IS CLICKED WHEN WE ARE ON A SMALL SCREEN

  closeSidebar() {

   this.smallScreen=this.interactions.closeSidebar(this.smallScreen, this.renderer, this.overlay.nativeElement);
  }


  toggleTab() {


  }

}
