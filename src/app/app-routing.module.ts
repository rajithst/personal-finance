import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';
import { TransactionDashboardComponent } from './finance/dashboard/dashboard.component';
import {dashboardResolver, payeeResolver} from './finance/service/resolvers';
import {PayeeRulesComponent} from "./finance/payee-rules/payee-rules.component";


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
      finance: dashboardResolver,
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
    path: 'payee-rules',
    component: PayeeRulesComponent,
    resolve: {
      payeeData: payeeResolver,
    },
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
