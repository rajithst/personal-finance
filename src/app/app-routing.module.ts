import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {TransactionComponent} from "./finance/transaction/transaction.component";
import {PageNotFoundComponent} from "./shared/page-not-found/page-not-found.component";
import {refreshResolver} from "./finance/service/resolvers";
import {TransactionDashboardComponent} from "./finance/dashboard/dashboard.component";

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard'
  },
  {
    path: 'dashboard',
    component: TransactionDashboardComponent,
    resolve: {
      all: refreshResolver
    }
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
    path: 'dashboard',
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
  {
    path: 'investments',
    loadChildren: () => import('./investments/investments.module').then(m => m.InvestmentsModule),
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
