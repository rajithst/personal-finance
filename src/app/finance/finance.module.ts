import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  ExpensesComponent,
  FinanceComponent, PaymentsComponent,
  SavingsComponent,
  TransactionDetailComponent
} from './transaction/transaction.component';
import {
  TransactionDeleteDialog,
  TransactionUpdateDialog,
} from './transaction-update/transaction-update.component';
import { TransactionTableComponent } from './transaction-table/transaction-table.component';
import { TransactionFilterComponent } from './transaction-filter/transaction-filter.component';
import { PayeeRulesComponent } from './payee-rules/payee-rules.component';
import { FinanceRoutingModule } from './finance.routing.module';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../shared/material.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IncomesComponent } from './transaction/incomes/incomes.component';
import { PayeeEditComponent } from './payee-rules/payee-edit/payee-edit.component';


@NgModule({
  declarations: [
    FinanceComponent,
    TransactionDetailComponent,
    TransactionUpdateDialog,
    TransactionDeleteDialog,
    TransactionTableComponent,
    TransactionFilterComponent,
    PayeeRulesComponent,
    ExpensesComponent,
    SavingsComponent,
    IncomesComponent,
    PaymentsComponent,
    PayeeEditComponent,
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
