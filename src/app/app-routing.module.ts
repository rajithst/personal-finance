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
    canActivate: [isUserAuthenticated],
    loadChildren: () =>
      import('./finance/dashboard/dashboard.module').then(
        (m) => m.DashboardModule,
      ),
    resolve: {
      finance: dashboardResolver,
    },

  },
  {
    path: 'finance',
    canActivate: [isUserAuthenticated],
    loadChildren: () =>
      import('./finance/transaction/transaction.module').then(
        (m) => m.TransactionModule,
      ),

  },
  {
    path: 'payee-settings',
    canActivate: [isUserAuthenticated],
    loadChildren: () =>
      import('./finance/payee-settings/payee-settings.module').then(
        (m) => m.PayeeSettingsModule,
      )
  },
  {
    path: 'reports',
    canActivate: [isUserAuthenticated],
    loadChildren: () =>
      import('./finance/reports/reports.module').then((m) => m.ReportsModule)
  },
  {
    path: 'investments',
    canActivate: [isUserAuthenticated],
    loadChildren: () =>
      import('./investments/investments.module').then(
        (m) => m.InvestmentsModule,
      )
  },
  {
    path: 'settings',
    canActivate: [isUserAuthenticated],
    loadChildren: () =>
      import('./settings/settings.module').then(
        (m) => m.SettingsModule,
      )
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
