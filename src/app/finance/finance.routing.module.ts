import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  ExpenseComponent, FinanceComponent,
  IncomeComponent,
  PaymentComponent,
  SavingComponent,
} from "./transaction/transaction.component";


const routes: Routes = [
  {
    path: '',
    component: FinanceComponent,
    children: [
      {
        path: '',
        redirectTo: 'transaction',
        pathMatch: 'full'
      },
      {
        path: 'transaction',
        component: ExpenseComponent,
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
        path: 'payments',
        component: PaymentComponent,
      },
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FinanceRoutingModule { }
