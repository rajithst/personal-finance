import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {TransactionComponent} from "./finance/transaction/transaction.component";
import {PageNotFoundComponent} from "./shared/page-not-found/page-not-found.component";

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'transactions'
  },
  {
    path: 'transactions',
    component: TransactionComponent,
    children: [
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
    ]
  },
  {
    path: 'investments',
    loadChildren: () => import('./investments/investments.module').then(m => m.InvestmentsModule)
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
