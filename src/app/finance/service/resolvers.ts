import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { inject } from '@angular/core';
import { ApiService } from '../../core/api.service';
import {Observable} from 'rxjs';
import {TransactionsResponse} from "../model/transactions";

export const financeResolver: ResolveFn<any> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
): Observable<TransactionsResponse> => {
  return inject(ApiService).getTransactions()
};


export const payeeResolver: ResolveFn<any> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  return inject(ApiService).getPayees()
};
