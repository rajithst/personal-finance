import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  ExpenseComponent,
  IncomeComponent,
  PaymentComponent,
  SavingComponent,
} from './finance/transaction/transaction.component';
import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';
import { TransactionDashboardComponent } from './finance/dashboard/dashboard.component';
import { financeResolver } from './finance/service/resolvers';

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
      all: financeResolver,
    },
  },
  {
    path: 'income',
    component: IncomeComponent,
  },
  {
    path: 'savings',
    component: SavingComponent,
  },
  {
    path: 'transactions',
    component: ExpenseComponent,
  },
  {
    path: 'payments',
    component: PaymentComponent,
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
