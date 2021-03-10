import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MaterialModules} from './material-module';
import { AppRoutingModule } from './app-routing/app-routing.module';

import {SidenavComponent} from './sidenav/sidenav.component';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { getAuthServiceConfigs } from './auth-service.config';

import {
  SocialLoginModule,
  AuthServiceConfig
} from "angular-6-social-login";

import 'hammerjs';
import { CreateshopComponent } from './createshop/createshop.component';



@NgModule({
  declarations: [
    AppComponent,
    SidenavComponent,
    HomeComponent,
    LoginComponent,
    CreateshopComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModules,
    AppRoutingModule,
    SocialLoginModule
  ],
  providers: [
    {
      provide: AuthServiceConfig,
      useFactory: getAuthServiceConfigs
    }
   ],
  entryComponents: [SidenavComponent, LoginComponent],
  bootstrap: [AppComponent, SidenavComponent]
})
export class AppModule { }
