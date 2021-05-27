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
import { AuthGuardService } from './services/auth-guard.service';
import { SignupGuardService } from './services/signup-guard.service';
import { DashboardService } from './services/dashboard.service';

import { HttpClientModule } from '@angular/common/http';
import { getAuthServiceConfigs } from './auth-service.config';
import { ProcessHttpmsgService } from './services/process-httpmsg.service';
import { AuthenticationService } from './services/auth.service';
import { StoreitemsService } from './services/storeitems.service';
import { CartService } from './services/cart.service';

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
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { StoreitemComponent } from './storeitem/storeitem.component';
import { StoreComponent } from './store/store.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { CartComponent } from './cart/cart.component';



@NgModule({
  declarations: [
    AppComponent,
    SidenavComponent,
    HomeComponent,
    LoginComponent,
    CreateshopComponent,
    SignupComponent,
    DashboardComponent,
    ProfileComponent,
    StoreitemComponent,
    StoreComponent,
    CartComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModules,
    SocialLoginModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    CreateshopService,
    ProcessHttpmsgService,
    LoginService,
    SignupService,
    AuthenticationService,
    AuthGuardService,
    SignupGuardService,
    DashboardService,
    StoreitemsService,
    CartService,
    {
      provide: 'baseURL', 
      useValue: baseURL
    },
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
  entryComponents: [SidenavComponent, LoginComponent, StoreitemComponent],
  bootstrap: [AppComponent, SidenavComponent]
})
export class AppModule { }



//? Choose a prebuilt theme name, or "custom" for a custom theme: Indigo/Pink
//? Set up global Angular Material typography styles? Yes
//? Set up browser animations for Angular Material? Yes
