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
  authToken: string = undefined;

  constructor(private http: HttpClient,
    private processHTTPMsgService: ProcessHttpmsgService,
    private router: Router) { }

  checkJWTtoken() {
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

  sendUsername(name: string) {
    this.username.next(name);
  }

  clearUsername() {
    this.username.next(undefined);
  }

  loadUserCredentials() {
    const credentials = JSON.parse(localStorage.getItem(this.tokenKey));
    console.log('loadUserCredentials ', credentials);
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

  useCredentials(credentials: any) {
    this.isAuthenticated = true;
    this.sendUsername(credentials.username);
    this.authToken = credentials.token;
  }

  destroyUserCredentials() {
    this.authToken = undefined;
    this.clearUsername();
    this.isAuthenticated = false;
    localStorage.removeItem(this.tokenKey);
  }

  signUp() {

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

  logOut() {
    this.destroyUserCredentials();
    return this.router.navigateByUrl('/');
  }

  isLoggedIn(): Boolean {
    return this.isAuthenticated;
  }

  getUsername(): Observable<string> {
    return this.username.asObservable();
  }

  getToken(): string {
    return this.authToken;
  }
}
