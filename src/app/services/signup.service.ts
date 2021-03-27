import { Injectable } from '@angular/core';
import { Signup } from '../shared/signup';
import { Observable } from 'rxjs';

import { map, catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { baseURL } from '../shared/baseurl';
import { ProcessHttpmsgService } from './process-httpmsg.service';

@Injectable({
  providedIn: 'root'
})
export class SignupService {

  constructor(private http: HttpClient,
  	private ProcessHttpmsgService: ProcessHttpmsgService) { }

  submitSignup(signup: Signup): Observable<Signup> {
  	const httpOptions = {
  		headers: new HttpHeaders({
  			'Content-Type': 'application/json'
  		})
  	};
  	return this.http.post<Signup>(baseURL + 'api/v1/auth/signup', signup, httpOptions)
  	.pipe(catchError(this.ProcessHttpmsgService.handleError));
  }
}
