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

import { ErrorComponent } from './error/error.component';

import { PasswordResetComponent } from './password-reset/password-reset.component';

import { PasswordChangeComponent } from './password-change/password-change.component';

const routes:Routes=[
					  {path:'', component:HomeComponent},
					  {path:'signup', component:SignupComponent, canActivate:[GuestGuard]},
					  {path:'login', component:LoginComponent, canActivate:[GuestGuard]},
					  {path:'password-reset', component:PasswordResetComponent},
					  {path:'password/reset/:token', component:PasswordChangeComponent},
					  {path:':tab', component:HomeComponent, canActivate:[AuthGuard]},
					  {path:'genre/:genre', component:HomeComponent, canActivate:[AuthGuard]},
					  {path:'account/activate/:token', component:ActivationUploadComponent, canActivate:[GuestGuard]},
					  {path:'show/:id/:name', component:TvShowDetailComponent, canActivate:[AuthGuard]},
					  {path:'**', component:ErrorComponent}
]

@NgModule({
  declarations: [],
  imports: [
  	RouterModule.forRoot(routes)
  ],
  exports:[RouterModule]
})
export class AppRoutingModule { }
