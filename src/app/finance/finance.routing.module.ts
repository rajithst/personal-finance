import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FinanceComponent } from './transaction/transaction.component';
import {ExpensesComponent} from "./transaction/expenses/expenses.component";
import {IncomesComponent} from "./transaction/incomes/incomes.component";
import {SavingsComponent} from "./transaction/savings/savings.component";
import {PaymentsComponent} from "./transaction/payments/payments.component";

const routes: Routes = [
  {
    path: '',
    component: FinanceComponent,
    children: [
      {
        path: '',
        redirectTo: 'transaction',
        pathMatch: 'full',
      },
      {
        path: 'transaction',
        component: ExpensesComponent,
        data: { name: 'transactions'}
      },
      {
        path: 'income',
        component: IncomesComponent,
        data: { name: 'incomes'}
      },
      {
        path: 'savings',
        component: SavingsComponent,
        data: { name: 'savings'}
      },
      {
        path: 'payments',
        component: PaymentsComponent,
        data: { name: 'payments'}
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FinanceRoutingModule {}
