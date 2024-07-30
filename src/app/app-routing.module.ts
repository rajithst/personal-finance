import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';
import { dashboardResolver } from './finance/service/resolvers';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard',
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
  },
  {
    path: 'finance',
    loadChildren: () =>
      import('./finance/transaction/transaction.module').then(
        (m) => m.TransactionModule,
      ),
  },
  {
    path: 'payee-settings',
    loadChildren: () =>
      import('./finance/payee-settings/payee-settings.module').then(
        (m) => m.PayeeSettingsModule,
      ),
  },
  {
    path: 'reports',
    loadChildren: () =>
      import('./finance/reports/reports.module').then((m) => m.ReportsModule),
  },
  {
    path: 'investments',
    loadChildren: () =>
      import('./investments/investments.module').then(
        (m) => m.InvestmentsModule,
      ),
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
