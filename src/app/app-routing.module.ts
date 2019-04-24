import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {Routes, RouterModule} from '@angular/router';

import { AuthGuardService as AuthGuard } from './auth-guard.service';

import { GuestGuardService as GuestGuard } from './guest-guard.service';

import { HomeComponent } from './home/home.component';

import { SignupComponent } from './signup/signup.component';

import { LoginComponent } from './login/login.component';

import { ActivationUploadComponent } from './activation-upload/activation-upload.component';

import { TvShowDetailComponent } from './tv-show-detail/tv-show-detail.component';

const routes:Routes=[
					  {path:'', component:HomeComponent},
					  {path:'signup', component:SignupComponent, canActivate:[GuestGuard]},
					  {path:'login', component:LoginComponent, canActivate:[GuestGuard]},
					  {path:'account/activate/:token', component:ActivationUploadComponent, canActivate:[GuestGuard]},
					  {path:'show/:id/:name', component:TvShowDetailComponent, canActivate:[AuthGuard]}
]

@NgModule({
  declarations: [],
  imports: [
  	RouterModule.forRoot(routes)
  ],
  exports:[RouterModule]
})
export class AppRoutingModule { }
