import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  ExpenseComponent,
  IncomeComponent,
  PaymentComponent, SavingComponent,
} from "./finance/transaction/transaction.component";
import {PageNotFoundComponent} from "./shared/page-not-found/page-not-found.component";
import {refreshResolver} from "./finance/service/resolvers";
import {TransactionDashboardComponent} from "./finance/dashboard/dashboard.component";
import {AnalyticsComponent} from "./finance/analytics/analytics.component";

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
    component: IncomeComponent
  },
  {
    path: 'savings',
    component: SavingComponent
  },
  {
    path: 'expense',
    component: ExpenseComponent
  },
  {
    path: 'payments',
    component: PaymentComponent
  },
  {
    path: 'analytics',
    component: AnalyticsComponent
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
