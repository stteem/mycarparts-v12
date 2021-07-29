import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of, Observable, Subject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { baseURL } from '../shared/baseurl';
import { ProcessHttpmsgService } from './process-httpmsg.service';


interface AuthResponse {
  firstname: string;
  token: string;
}

interface JWTResponse {
  status: string;
  success: string;
  user: any;
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  tokenKey = 'JWT';
  isAuthenticated: Boolean = false;
  username: Subject<string> = new Subject<string>();
  logged: Subject<boolean> = new Subject<boolean>();
  authToken: string = undefined;

  constructor(private http: HttpClient,
    private processHTTPMsgService: ProcessHttpmsgService,
    private router: Router) { }

  checkSomething() {
    this.http.get<JWTResponse>(baseURL + 'api/v1/auth/checkJWTtoken')
    .subscribe(res => {
      console.log('JWT Token Valid: ', res);
      this.sendUsername(res.user);
    },
    err => {
      console.log('JWT Token invalid: ', err);
      this.destroyUserCredentials();
    });
  }

  checkJWTtoken() {
    this.http.get<JWTResponse>(baseURL + 'api/v1/auth/checkJWTtoken')
    .subscribe({
      next: (res) => {
        console.log('JWT Token Valid: ', res);
        this.sendUsername(res.user);
      },
      error: (e) => {
        console.error('JWT Token invalid: ', e);
        this.destroyUserCredentials();
      },
      complete: () => console.info('complete')
    })
  }

  sendUsername(name: string) {
    this.username.next(name);
  }

  clearUsername() {
    this.username.next(undefined);
  }

  useCredentials(credentials: any) {
    this.isAuthenticated = true;
    this.logged.next(true);
    this.sendUsername(credentials.username);
    this.authToken = credentials.token;
  }

  loadUserCredentials() {
    const credentials = JSON.parse(localStorage.getItem(this.tokenKey));
    //console.log('loadUserCredentials ', credentials);
    if (credentials && credentials.username !== undefined) {
      this.useCredentials(credentials);
      if (this.authToken) {
       this.checkJWTtoken();
      }
    }
  }

  storeUserCredentials(credentials: any) {
    console.log('storeUserCredentials ', credentials);
    localStorage.setItem(this.tokenKey, JSON.stringify(credentials));
    this.useCredentials(credentials);
  }

  logIn(user: any): Observable<any> {
    return this.http.post<AuthResponse>(baseURL + 'api/v1/auth/logincustom', user)
      .pipe( map(res => {
        console.log('pipe res ',res);
          this.storeUserCredentials({username: res.firstname, token: res.token});
          return {'success': true, 'username': res.firstname };
      }),
       /*catchError(error => {
        console.error("error caught", error);
          return of({errMsg: error.error.status});
       })*/
       catchError(error => this.processHTTPMsgService.handleError(error)));
  }

  checkCart():void {
    const shipping = localStorage.getItem('shipping');
    const order = localStorage.getItem('order');

    if (order) {
      localStorage.removeItem('order');
    }
    if (shipping) {
      localStorage.removeItem('shipping');
    } 
    else {
      return;
    }
  }

  destroyUserCredentials() {
    this.authToken = undefined;
    this.clearUsername();
    this.isAuthenticated = false;
    localStorage.removeItem(this.tokenKey);
    this.checkCart();
  }

  logOut() {
    this.destroyUserCredentials();
    return this.router.navigateByUrl('/');
  }

  isLoggedIn(): Boolean {
    return this.isAuthenticated;
  }

  loggedIn(): Observable<boolean> {
    return this.logged.asObservable();
  }

  getUsername(): Observable<string> {
    return this.username.asObservable();
  }

  getToken(): string {
    return this.authToken;
  }
}
