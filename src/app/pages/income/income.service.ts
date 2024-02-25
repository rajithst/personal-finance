import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';

import { HttpErrorHandler, HandleError } from '../../service/http-error-handler.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
  })
};

@Injectable()
export class IncomeService {
  srcURL = 'api/income';
  private handleError: HandleError;


  constructor(
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandler) {
    this.handleError = httpErrorHandler.createHandleError('HeroesService');
  }

  addIncome(payload: any){
    return this.http.post('api/income/add', payload).pipe(
      catchError(this.handleError())
    );
  }

}