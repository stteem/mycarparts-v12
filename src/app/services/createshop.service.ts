import { Injectable } from '@angular/core';
import { Shop } from '../shared/shop';
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

    createShop(shop: Shop): Observable<Shop> {
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      };
      return this.http.post<Shop>(baseURL + 'api/v1/shop', shop, httpOptions)
      .pipe(catchError(this.ProcessHttpmsgService.handleError));
    }
}
