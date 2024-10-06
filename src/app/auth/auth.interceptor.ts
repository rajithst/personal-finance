import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();
  const newReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });
  return next(newReq).pipe(
    catchError((err) => {
      if (
        err.status === 401 && err.url !== `${environment.apiUrl}/auth/jwt/create`
      ) {
        authService.unAuthorizedLogout();
      }
      const error = err.error.message || err.statusText;
      return throwError(error);
    }),
  );
};
