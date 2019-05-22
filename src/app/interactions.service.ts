import { Injectable, Renderer2 } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InteractionsService {

  constructor() { }


  // DISPLAYING THE IMAGE UPLOAD COMPONENT

 	toggleImageUploadComponent(renderer:Renderer2, overlay, param:boolean, container:any):boolean {

  	if(param){

   		 renderer.removeClass(overlay, 'active');

       renderer.removeClass(container, 'hidden');
   	}
   	else {

   		 renderer.addClass(overlay, 'active');		

       renderer.addClass(container, 'hidden');
   	}

   	param=!param; 

   	return param;

  }

  // TOGGLING THE DISPLAY OF THE SIDEBAR ON A SCREEN BETWEEN 501px AND 768px

  toggleSideBarVisible(param:boolean, renderer:Renderer2, overlay:any, container:any):boolean{

    if(screen.width <= 768 && screen.width > 500) {

       if(!param) {

         param=!param;


         // ADDING THE TRANSPARENT BACKGROUND TO THE BODY CONTENT WHEN THE SIDEBAR BECOMES VISIBLE BETWEEN 
         // 501px and 768px

        renderer.addClass(overlay, 'active');

        renderer.addClass(container, 'hidden');

         return param;
      }

      param=!param;

      renderer.removeClass(overlay, 'active');

      renderer.removeClass(container, 'hidden');

      return param;
    }

    return param;

  }


  // TOGGLING THE BURSTING OUT OF THE SIDEBAR WHEN ON A SCREEN BELOW 500px

  toggleSideBarSmall(param:boolean, overlay:any):boolean {

      if(screen.width <= 500) {

        param=!param

        overlay.classList.toggle('active');
        
      }

      return param;
  }


  // CLOSING THE SIDEBAR WHEN ON SMALL SCREEN <= 500px

  closeSidebar(param:boolean, renderer:Renderer2, overlay:any) {

    if(screen.width <= 500) {

       param=false;

       renderer.removeClass(overlay, 'active');

       return param;
     }

     return param;
  }

}
