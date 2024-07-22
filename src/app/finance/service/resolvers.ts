import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { inject } from '@angular/core';
import { ApiService } from '../../core/api.service';
import {Observable} from 'rxjs';
import {DashboardResponse, TransactionsResponse} from "../model/transactions";

export const dashboardResolver: ResolveFn<any> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
): Observable<DashboardResponse> => {
  return inject(ApiService).getDashboard()
};


export const payeeResolver: ResolveFn<any> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  return inject(ApiService).getPayees()
};
