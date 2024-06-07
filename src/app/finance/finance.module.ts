import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FinanceComponent } from './transaction/transaction.component';
import {
  TransactionDeleteDialog,
  TransactionUpdateDialog,
} from './transaction-update/transaction-update.component';
import { TransactionTableComponent } from './transaction-table/transaction-table.component';
import { TransactionDetailDialog } from './transaction-detail/transaction-detail.component';
import { TransactionFilterComponent } from './transaction-filter/transaction-filter.component';
import { PayeeRulesComponent } from './payee-rules/payee-rules.component';
import { FinanceRoutingModule } from './finance.routing.module';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../shared/material.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ExpensesComponent } from './transaction/expenses/expenses.component';
import { SavingsComponent } from './transaction/savings/savings.component';
import { IncomesComponent } from './transaction/incomes/incomes.component';
import { PaymentsComponent } from './transaction/payments/payments.component';

@NgModule({
  declarations: [
    FinanceComponent,
    TransactionUpdateDialog,
    TransactionDeleteDialog,
    TransactionTableComponent,
    TransactionDetailDialog,
    TransactionFilterComponent,
    PayeeRulesComponent,
    ExpensesComponent,
    SavingsComponent,
    IncomesComponent,
    PaymentsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MaterialModule,
    FontAwesomeModule,
    FinanceRoutingModule,
  ],
  providers: [],
})
export class FinanceModule {}
