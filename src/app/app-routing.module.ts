import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';
import { TransactionDashboardComponent } from './finance/dashboard/dashboard.component';
import { financeResolver } from './finance/service/resolvers';
import {DashboardExtComponent} from "./dashboard-ext/dashboard-ext.component";


const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard',
  },
  {
    path: 'dashboard',
    component: TransactionDashboardComponent,
    resolve: {
      finance: financeResolver,
    },
  },
  {
    path: 'finance',
    loadChildren: () =>
      import('./finance/finance.module').then(
        (m) => m.FinanceModule,
      ),
  },

  {
    path: 'investments',
    loadChildren: () =>
      import('./investments/investments.module').then(
        (m) => m.InvestmentsModule,
      ),
  },
  {
    path: 'dashboard-ext',
    component: DashboardExtComponent,
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
