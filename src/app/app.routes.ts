import { Routes } from '@angular/router';
import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';
import { isUserAuthenticated } from './auth/auth.guard';
import {
  payeeResolver,
  profileResolver,
  settingsResolver,
} from './service/resolvers';

export const APP_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard',
  },
  {
    path: 'login',
    loadChildren: () => import('./auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: 'dashboard',
    canActivate: [isUserAuthenticated],
    loadChildren: () =>
      import('./finance/dashboard/dashboard.routes').then(
        (m) => m.FINANCE_DASHBOARD_ROUTES,
      ),
  },
  {
    path: 'finance',
    canActivate: [isUserAuthenticated],
    loadChildren: () =>
      import('./finance/transaction/transaction.routes').then(
        (m) => m.TRANSACTION_ROUTES,
      ),
  },
  {
    path: 'payee-settings',
    canActivate: [isUserAuthenticated],
    loadChildren: () =>
      import('./finance/payee-settings/payee-settings.routes').then(
        (m) => m.PAYEE_SETTINGS_ROUTES,
      ),
    resolve: {
      payeeData: payeeResolver,
    },
  },
  {
    path: 'reports',
    canActivate: [isUserAuthenticated],
    loadChildren: () =>
      import('./finance/reports/reports.routes').then((m) => m.REPORTS_ROUTES),
  },
  {
    path: 'investments',
    canActivate: [isUserAuthenticated],
    loadChildren: () =>
      import('./investments/investments.routes').then(
        (m) => m.INVESTMENT_ROUTES,
      ),
  },
  {
    path: 'settings',
    canActivate: [isUserAuthenticated],
    loadChildren: () =>
      import('./settings/settings.routes').then((m) => m.SETTINGS_ROUTES),
    resolve: {
      settings: settingsResolver,
    },
  },
  {
    path: 'profile',
    canActivate: [isUserAuthenticated],
    loadChildren: () =>
      import('./profile/profile.routes').then((m) => m.PROFILE_ROUTES),
    resolve: {
      myAccount: profileResolver,
    },
  },
  {
    path: '**',
    component: PageNotFoundComponent,
  },
];
