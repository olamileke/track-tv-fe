import { Injectable, Renderer2, ElementRef } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  private base_url:string='http://localhost:8000';

  constructor() { }

  // GETTER TO OBTAIN API KEY FOR TMDB API

  get apiKey():string {

    const apiKey='a22d7a33b97250f682073a165856d1d7'; 

    return apiKey;
  }

  // GETTER TO OBTAIN API TOKEN FOR THE BACKEND

  get apiToken():string {

    if(sessionStorage.api_token !== null) {

      return sessionStorage.api_token;
    }

    if(localStorage.api_token !== null) {

      return localStorage.api_token;
    }
  }


  // GETTER TO OBTAIN PROFILE PICTURE LINK

  get profileImage():string {

    if(sessionStorage.profileImage !== null) {

      return sessionStorage.profileImage;
    }

    if(localStorage.profileImage !== null) {

      return localStorage.profileImage;
    }
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
