import { Injectable } from '@angular/core';
import { Item } from '../shared/item';
import { Observable, BehaviorSubject, Subject } from 'rxjs';

import { catchError, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { baseURL } from '../shared/baseurl';
import { ProcessHttpmsgService } from './process-httpmsg.service';

@Injectable({
  providedIn: 'root'
})
export class StoreitemsService {

  private currentItem = new BehaviorSubject({});
  //currentItem : Subject<object> = new Subject<object>();

  constructor(private http: HttpClient,
  	private ProcessHttpmsgService: ProcessHttpmsgService) { }

  submitItem(storeId: string, item: Item, file: File){
    console.log('store service file', file)
    console.log('store service items', item)
    const form: any = new FormData();
    form.append('image', file);
    //form.append('item', item);
    //form.append('storeid', storeId);
    for ( var key in item ) {
      form.append(key, item[key]);
    }
    
    return this.http.post<any>(baseURL + 'api/v1/shop/' + storeId + '/items', form)
    .pipe(catchError(this.ProcessHttpmsgService.handleError));

  }
  
  getItems(store_id: string): Observable<Item[]> {
    return this.http.get<Item[]>(baseURL + 'api/v1/shop/' + store_id + '/items')
      .pipe(catchError(this.ProcessHttpmsgService.handleError));
  }

  getCurrentItem(): Observable<object> {
    return this.currentItem.asObservable();
  }
}
