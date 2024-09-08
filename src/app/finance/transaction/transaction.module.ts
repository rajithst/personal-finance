import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  ExpensesComponent,
  FinanceComponent,
  IncomesComponent,
  PaymentsComponent,
  SavingsComponent,
  TransactionDetailComponent,
} from './transaction.component';
import {
  TransactionDeleteDialog,
  TransactionUpdateDialog,
} from './transaction-update/transaction-update.component';
import { TransactionTableComponent } from './transaction-table/transaction-table.component';
import { TransactionFilterComponent } from './transaction-filter/transaction-filter.component';
import { TransactionRoutingModule } from './transaction.routing.module';
import { SharedModule } from '../../shared/shared.module';
import { MaterialModule } from '../../shared/material.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { TransactionSplitComponent } from './transaction-split/transaction-split.component';
import { TransactionBulkEditComponent } from './transaction-bulk-edit/transaction-bulk-edit.component';
import { TransactionImportComponent } from './transaction-import/transaction-import.component';

@NgModule({
  declarations: [
    FinanceComponent,
    TransactionDetailComponent,
    TransactionUpdateDialog,
    TransactionDeleteDialog,
    TransactionTableComponent,
    TransactionFilterComponent,
    ExpensesComponent,
    SavingsComponent,
    IncomesComponent,
    PaymentsComponent,
    TransactionSplitComponent,
    TransactionBulkEditComponent,
    TransactionImportComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MaterialModule,
    FontAwesomeModule,
    TransactionRoutingModule,
  ],
  providers: [
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: {
        width: '850px',
        position: {
          top: '5%',
        },
      },
    },
  ],
})
export class TransactionModule {}
