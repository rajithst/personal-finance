import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { inject } from '@angular/core';
import { ApiService } from '../core/api.service';
import { Observable } from 'rxjs';
import { UserProfile } from './model';

export const profileResolver: ResolveFn<any> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
): Observable<UserProfile> => {
  return inject(ApiService).getMyProfile();
};
