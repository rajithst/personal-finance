import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';
import { dashboardResolver } from './finance/service/resolvers';
import {isUserAuthenticated} from "./auth/auth.guard";

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard',
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./auth/auth.module').then(
        (m) => m.AuthModule,
      ),
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./finance/dashboard/dashboard.module').then(
        (m) => m.DashboardModule,
      ),
    resolve: {
      finance: dashboardResolver,
    },
    canActivate: [isUserAuthenticated]
  },
  {
    path: 'finance',
    loadChildren: () =>
      import('./finance/transaction/transaction.module').then(
        (m) => m.TransactionModule,
      ),
    canActivate: [isUserAuthenticated]
  },
  {
    path: 'payee-settings',
    loadChildren: () =>
      import('./finance/payee-settings/payee-settings.module').then(
        (m) => m.PayeeSettingsModule,
      ),
    canActivate: [isUserAuthenticated]
  },
  {
    path: 'reports',
    loadChildren: () =>
      import('./finance/reports/reports.module').then((m) => m.ReportsModule),
    canActivate: [isUserAuthenticated]
  },
  {
    path: 'investments',
    loadChildren: () =>
      import('./investments/investments.module').then(
        (m) => m.InvestmentsModule,
      ),
    canActivate: [isUserAuthenticated]
  },
  {
    path: 'settings',
    loadChildren: () =>
      import('./settings/settings.module').then(
        (m) => m.SettingsModule,
      ),
    canActivate: [isUserAuthenticated]
  },
  {
    path: '**',
    component: PageNotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
