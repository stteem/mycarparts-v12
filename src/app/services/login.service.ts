import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';

import { map, catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { baseURL } from '../shared/baseurl';
import { ProcessHttpmsgService } from './process-httpmsg.service';

interface SocialUser {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private messageSource = new BehaviorSubject({});
  currentMessage = this.messageSource.asObservable();

  constructor(private http: HttpClient,
  	private ProcessHttpmsgService: ProcessHttpmsgService) { }

  loginSocialUser(socialuser: object) {
    const httpOptions = {
  		headers: new HttpHeaders({
  			'Content-Type': 'application/json'
  		})
  	};
    console.log('this social ', socialuser);
  	return this.http.post<SocialUser>(baseURL + 'api/v1/auth/loginsocial', socialuser, httpOptions)
  	.pipe(map(res => {
      console.log('res', res);
      this.messageSource.next(res);
      console.log("i've been called ", this.currentMessage );
    }),catchError(this.ProcessHttpmsgService.handleError));
  }
}
