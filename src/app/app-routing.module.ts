import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { IncomeComponent } from './finance/income/income.component';
import { SavingsComponent } from './finance/savings/savings.component';
import { DebtsComponent } from './finance/debts/debts.component';
import { SpendingsComponent } from './finance/spendings/spendings.component';
import { BillsAndSubscriptionsComponent } from './finance/bills-and-subscriptions/bills-and-subscriptions.component';

const routes: Routes = [
  {
    path: '',
    component: AppComponent
  },
  {
    path: 'income',
    component: IncomeComponent
  },
  {
    path: 'savings',
    component: SavingsComponent
  },
  {
    path: 'debts',
    component: DebtsComponent
  },
  {
    path: 'spendings',
    component: SpendingsComponent
  },
  {
    path: 'bills-and-subscription',
    component: BillsAndSubscriptionsComponent
  },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
