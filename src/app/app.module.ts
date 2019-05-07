import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AppRoutingModule } from './app-routing.module';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ToastrModule } from 'ngx-toastr'; 

import { FormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';

import { NotificationsService } from './notifications.service';
import { UserService } from './user.service';

import { AuthService } from './auth.service';

import { ConfigService } from './config.service';

import { InteractionsService } from './interactions.service';

import { AuthGuardService } from './auth-guard.service';
import { ActivationUploadComponent } from './activation-upload/activation-upload.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderComponent } from './header/header.component';
import { SubscriptionsComponent } from './subscriptions/subscriptions.component';
import { TopRatedComponent } from './top-rated/top-rated.component';
import { TvShowComponent } from './tv-show/tv-show.component';
import { PopularComponent } from './popular/popular.component';
import { ExploreComponent } from './explore/explore.component';
import { GenreComponent } from './genre/genre.component';
import { TvShowDetailComponent } from './tv-show-detail/tv-show-detail.component';
import { ImageUploadComponent } from './image-upload/image-upload.component';
import { ErrorComponent } from './error/error.component';
import { SimilarShowComponent } from './similar-show/similar-show.component';
import { ActorComponent } from './actor/actor.component';
import { EpisodeInfoComponent } from './episode-info/episode-info.component';
import { UnSubscribeComponent } from './un-subscribe/un-subscribe.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SignupComponent,
    LoginComponent,
    ActivationUploadComponent,
    SidebarComponent,
    HeaderComponent,
    SubscriptionsComponent,
    TopRatedComponent,
    TvShowComponent,
    PopularComponent,
    ExploreComponent,
    GenreComponent,
    TvShowDetailComponent,
    ImageUploadComponent,
    ErrorComponent,
    SimilarShowComponent,
    ActorComponent,
    EpisodeInfoComponent,
    UnSubscribeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
  ],
  providers: [
    NotificationsService,
    UserService,
    AuthService,
    AuthGuardService,
    ConfigService,
    InteractionsService
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
