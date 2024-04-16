import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {TransactionComponent} from "./finance/transaction/transaction.component";

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/income'
  },
  {
    path: 'income',
    component: TransactionComponent
  },
  {
    path: 'savings',
    component: TransactionComponent
  },
  {
    path: 'debts',
    component: TransactionComponent
  },
  {
    path: 'expense',
    component: TransactionComponent
  },
  {
    path: 'payments',
    component: TransactionComponent
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
