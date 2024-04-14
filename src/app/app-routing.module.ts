import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { IncomeComponent } from './finance/income/income.component';
import { SavingsComponent } from './finance/savings/savings.component';
import { DebtsComponent } from './finance/debts/debts.component';
import { ExpenseComponent } from './finance/expense/expense.component';
import { PaymentComponent } from './finance/payment/payment.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/income'
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
    path: 'expense',
    component: ExpenseComponent
  },
  {
    path: 'payments',
    component: PaymentComponent
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
