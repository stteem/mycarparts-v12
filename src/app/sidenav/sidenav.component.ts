import {MediaMatcher} from '@angular/cdk/layout';
import {ChangeDetectorRef, Component, OnInit, AfterViewInit, OnDestroy} from '@angular/core';
import { MatDialog } from '@angular/material';
import { LoginComponent } from '../login/login.component';
import { LoginService } from "../services/login.service";
import { AuthenticationService } from '../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent implements OnInit, AfterViewInit, OnDestroy {
  mobileQuery: MediaQueryList;
  socialuser: Object;
  subscription: Subscription;
  username: String;
    
  private _mobileQueryListener: () => void;

  constructor(
      changeDetectorRef: ChangeDetectorRef, 
      media: MediaMatcher,
      public dialog: MatDialog,
      private loginservice: LoginService,
      private authService: AuthenticationService
  ) 
  {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.socialuser = this.loginservice.currentMessage;
  }

  ngOnInit() {
    this.subscription = this.loginservice.currentMessage.subscribe(user => this.socialuser = user);
    console.log('sidenav social user ', this.socialuser);
    Promise.resolve().then(() => {
      this.authService.loadUserCredentials();
    })
    .then(() => {
      this.subscription = this.authService.getUsername()
        .subscribe(name => { console.log(name); this.username = name; });
    });
  }

  ngAfterViewInit() {
    
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
    this.subscription.unsubscribe();
  }

  logOut() {
    this.authService.logOut();
  }

  openLoginForm() {
  	this.dialog.open(LoginComponent, {width: '400px', height: '600px'});
  }

}


/**  Copyright 2020 Google LLC. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at http://angular.io/license */
