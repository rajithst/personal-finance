import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { inject } from '@angular/core';
import { ApiService } from '../core/api.service';
import { Observable, of } from 'rxjs';
import { DashboardResponse } from '../model/dashboard';
import { MyProfile } from '../model/profile';

export const dashboardResolver: ResolveFn<any> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
): Observable<DashboardResponse> => {
  return inject(ApiService).getDashboard();
};

export const payeeResolver: ResolveFn<any> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  return inject(ApiService).getPayees();
};

export const payeeDetailResolver: ResolveFn<any> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  const payeeId = route.params.hasOwnProperty('id');
  const payeeName = route.params.hasOwnProperty('name');
  if (payeeId) {
    return inject(ApiService).getPayeeDetail(route.params['id']);
  } else if (payeeName) {
    return inject(ApiService).getPayeeDetailByName(route.params['name']);
  } else {
    return of({});
  }
};

export const settingsResolver: ResolveFn<any> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  return inject(ApiService).initSettings();
};

export const profileResolver: ResolveFn<any> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
): Observable<MyProfile> => {
  return inject(ApiService).getMyProfile();
};
