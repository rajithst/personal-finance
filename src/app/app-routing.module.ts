import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';
import { dashboardResolver, payeeResolver } from './finance/service/resolvers';


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
    path: 'payee-rules',
    loadChildren: () =>
      import('./finance/payee-rules/payee-rules.module').then(
        (m) => m.PayeeRulesModuleModule,
      ),
    resolve: {
      payeeData: payeeResolver,
    },
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
