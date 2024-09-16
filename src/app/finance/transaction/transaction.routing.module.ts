import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  ExpensesComponent,
  FinanceComponent,
  IncomesComponent,
  PaymentsComponent,
  SavingsComponent,
} from './transaction.component';
import { EXPENSE, INCOME, PAYMENT, SAVING } from '../../data/shared.data';

const routes: Routes = [
  {
    path: '',
    component: FinanceComponent,
    children: [
      {
        path: '',
        redirectTo: EXPENSE,
        pathMatch: 'full',
      },
      {
        path: EXPENSE,
        component: ExpensesComponent,
        title: 'Expense Activity',
      },
      {
        path: INCOME,
        component: IncomesComponent,
        title: 'Income Activity',
      },
      {
        path: SAVING,
        component: SavingsComponent,
        title: 'Savings Activity',
      },
      {
        path: PAYMENT,
        component: PaymentsComponent,
        title: 'Payments Activity',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TransactionRoutingModule {}
