import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams  } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { baseURL } from '../shared/baseurl';
import { ProcessHttpmsgService } from './process-httpmsg.service';

interface QueryParams {
  vehicletype: string;
  model: string;
  year: string;
  part: string;
  state: string;
  city: string;
}

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private http: HttpClient,
  	private ProcessHttpmsgService: ProcessHttpmsgService) { }

  searchStores(query: any): Observable<any> {
    console.log('search service ', query);
    const { vehicletype, model, year, part, state, city } = query;
    let params = new HttpParams()
                .set('vehicletype', vehicletype)
                .set('model', model)
                .set('year', year)
                .set('part', part)
                .set('state', state)
                .set('city', city);
                console.log('search params ', params);
    
    return this.http.get<QueryParams>(baseURL + 'api/v1/search', {params: params} )
    .pipe(catchError(this.ProcessHttpmsgService.handleError));
  }
}
