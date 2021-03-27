import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MaterialModules} from './material-module';
import { AppRoutingModule } from './app-routing/app-routing.module';

import {SidenavComponent} from './sidenav/sidenav.component';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';

import { CreateshopService } from './services/createshop.service';
import { SignupService } from './services/signup.service';
import { LoginService } from './services/login.service';

import { HttpClientModule } from '@angular/common/http';
import { getAuthServiceConfigs } from './auth-service.config';
import { ProcessHttpmsgService } from './services/process-httpmsg.service';
import { AuthenticationService } from './services/auth.service';
import { AuthInterceptor, UnauthorizedInterceptor } from './services/auth.interceptor';
import {HTTP_INTERCEPTORS} from '@angular/common/http';


import { baseURL } from './shared/baseurl';



import {
  SocialLoginModule,
  AuthServiceConfig
} from "angular-6-social-login";

import 'hammerjs';
import { CreateshopComponent } from './createshop/createshop.component';
import { SignupComponent } from './signup/signup.component';



@NgModule({
  declarations: [
    AppComponent,
    SidenavComponent,
    HomeComponent,
    LoginComponent,
    CreateshopComponent,
    SignupComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModules,
    SocialLoginModule
  ],
  providers: [
    CreateshopService,
    ProcessHttpmsgService,
    LoginService,
    SignupService,
    AuthenticationService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: UnauthorizedInterceptor,
      multi: true
    },
    {
      provide: 'BaseURL', 
      useValue: baseURL
    },
    {
      provide: AuthServiceConfig,
      useFactory: getAuthServiceConfigs
    }
   ],
  entryComponents: [SidenavComponent, LoginComponent],
  bootstrap: [AppComponent, SidenavComponent]
})
export class AppModule { }
