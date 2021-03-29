import { Injectable } from '@angular/core';
import { Createshop } from '../shared/createshop';
import { Observable } from 'rxjs';

import { map, catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { baseURL } from '../shared/baseurl';
import { ProcessHttpmsgService } from './process-httpmsg.service';

@Injectable({
  providedIn: 'root'
})
export class CreateshopService {

  constructor(private http: HttpClient,
  	private ProcessHttpmsgService: ProcessHttpmsgService) { }

    createShop(createshop: Createshop): Observable<Createshop> {
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      };
      return this.http.post<Createshop>(baseURL + 'api/v1/shop', createshop, httpOptions)
      .pipe(catchError(this.ProcessHttpmsgService.handleError));
    }
}
