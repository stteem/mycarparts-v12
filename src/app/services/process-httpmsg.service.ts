import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ProcessHttpmsgService {

  constructor() { }

  public handleError(error: HttpErrorResponse | any) {
    let errMsg: string;

    if (error.error instanceof ErrorEvent) {
      errMsg = error.error.message;
    }
    if (error.status == 500) {
      console.log('error ', error);
      errMsg = `Something went wrong, an ${error.statusText}, please try again.`;
    }
    if (error.status == 0) {
      console.log('error ', error);
      errMsg = `No internet connection, please try again.`;
    }
    else {
      //errMsg = `${error.status} - ${error.statusText || ''} ${error.error}`;
      console.log('error ', error);
      errMsg = error.error.status;
      
    }

    return throwError(errMsg);
  }
}
