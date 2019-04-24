import { Injectable, Renderer2 } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InteractionsService {

  constructor() { }


  // DISPLAYING THE IMAGE UPLOAD COMPONENT

 	toggleImageUploadComponent(renderer:Renderer2, overlay, param:boolean):boolean {

  	if(param){

   		 renderer.removeClass(overlay, 'active');
   	}
   	else {

   		 renderer.addClass(overlay, 'active');		   		
   	}

   	param=!param; 

   	return param;

  }
}
