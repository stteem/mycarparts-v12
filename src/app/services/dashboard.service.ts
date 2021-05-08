import { Injectable } from '@angular/core';
import { Shop } from '../shared/shop';

import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { baseURL } from '../shared/baseurl';
import { ProcessHttpmsgService } from './process-httpmsg.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient,
    private processHTTPMsgService: ProcessHttpmsgService) { }

  getShops(): Observable<Shop[]> {
    return this.http.get<Shop[]>(baseURL + 'api/v1/shop')
      .pipe(catchError(this.processHTTPMsgService.handleError));
  }
}
