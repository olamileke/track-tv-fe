import { Injectable, Renderer2, ElementRef } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  private base_url:string='http://localhost';

  constructor() { }

  // GETTER TO OBTAIN API KEY FOR TMDB API

  get apiKey():string {

    const apiKey='a22d7a33b97250f682073a165856d1d7'; 

    return apiKey;
  }

  // GETTER TO OBTAIN API TOKEN FOR THE BACKEND

  get apiToken():string {

    if(sessionStorage.api_token != '' && sessionStorage.api_token != undefined) {

      return sessionStorage.api_token;
    }

    if(localStorage.api_token != '') {

      return localStorage.api_token;
    }
  }


  // GETTER TO OBTAIN PROFILE PICTURE LINK

  get profileImage():string {

    if(sessionStorage.profileImage != '' && sessionStorage.profileImage != undefined ) {

      return sessionStorage.profileImage;
    }

    if(localStorage.profileImage != '' && localStorage.profileImage != undefined) {

      return localStorage.profileImage;
    }

    return 'http://localhost/Images/Users/anon.jpg';
  }

  get baseURL():string {

    return this.base_url;
  }

  // METHOD SETTING THE APPROPRIATE STYLING WHEN THE SIDEBAR BECOMES FIXED

  scrollHandler(renderer:Renderer2, elRef:ElementRef) {

  	const heightVal=56 + (0.03 * screen.height);

  	if(window.pageYOffset > heightVal && screen.width > 768) {

  		renderer.addClass(elRef.nativeElement, 'sidebarFixed');
  	} 
  	else {

  		renderer.removeClass(elRef.nativeElement, 'sidebarFixed');
  	}

  }
  
}
