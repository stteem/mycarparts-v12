import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';

import { map, catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { baseURL } from '../shared/baseurl';
import { ProcessHttpmsgService } from './process-httpmsg.service';

interface SocialLogin {
  email: string;
  image: string;
  name: string;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private messageSource = new BehaviorSubject({});
  currentMessage = this.messageSource.asObservable();

  constructor(private http: HttpClient,
  	private ProcessHttpmsgService: ProcessHttpmsgService) { }


  sendSocialUser(user: any) {
    return this.messageSource.next(user);
  };
  

  loginSocialUser(socialuser: any) {
  
    console.log('this social ', socialuser);
  	/*return this.http.post<any>(baseURL + 'api/v1/auth/loginsocial', socialuser)
  	.pipe(map(res => {
      console.log('res', res);
      this.sendSocialUser(res);
      //console.log("i've been called ", this.currentMessage );
    }),catchError(error => this.ProcessHttpmsgService.handleError(error)));*/

    return this.http.get<any>(baseURL + 'api/v1/auth/loginsocial').subscribe(res => {
      console.log(res);
    });
  };

  /*logIn(user: any): Observable<any> {
    return this.http.post<AuthResponse>(baseURL + 'api/v1/auth/logincustom', user)
      .pipe( map(res => {
          this.storeUserCredentials({username: res.firstname, token: res.token});
          return {'success': true, 'username': res.firstname };
      }),
       catchError(error => this.processHTTPMsgService.handleError(error)));
  }*/
}
