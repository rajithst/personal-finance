import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';

const routes: Routes = [
  {
    path: '',
    component: AppComponent
  },
  {
    path: 'income',
    loadChildren: () => import('./pages/income/income.module').then(m => m.IncomeModule)
  },
  {
    path: 'spendings',
    loadChildren: () => import('./pages/spendings/spendings.module').then(m => m.SpendingsModule)
  },
  {
    path: 'debts',
    loadChildren: () => import('./pages/debts/debts.module').then(m => m.DebtsModule)
  },
  {
    path: 'savings',
    loadChildren: () => import('./pages/savings/savings.module').then(m => m.SavingsModule)
  },
  {
    path: 'bills-and-subscriptions',
    loadChildren: () => import('./pages/bills-and-subscriptions/bills-and-subscriptions.module').then(m => m.BillsAndSubscriptionsModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
