import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from './auth.service';
import { LoginComponent } from '../login/login.component';
import { MatDialog } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(
    public auth: AuthenticationService, 
    public router: Router,
    public dialog: MatDialog
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!this.auth.isLoggedIn()) {
      //this.router.navigate(['home']);
      this.dialog.open(LoginComponent, {width: '400px', height: '600px'});
      return false;
    }
    return true;
  }
}