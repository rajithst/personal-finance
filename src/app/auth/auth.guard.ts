import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import {AuthStore} from "./auth.store";

export const isUserAuthenticated: CanActivateFn = (route, state) => {
  const store = inject(AuthStore);
  const router = inject(Router);
  if (store.isLoggedIn()) {
    return true;
  } else {
    return router.parseUrl('/login');
  }
};
