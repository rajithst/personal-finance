import { Component, inject, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import {
  TRANSACTION_TYPES,
  SUCCESS_ACTION,
  ERROR_ACTION,
  CANCEL_ACTION,
  TRANSACTION_TYPE_PAYMENTS_ID,
  TRANSACTION_TYPE_SAVINGS_ID,
  TRANSACTION_TYPE_INCOME_ID,
  TRANSACTION_TYPE_EXPENSE_ID,
} from '../../../data/client.data';
import {
  TransactionExpand,
  TransactionMergeRequest,
  TransactionRequest,
} from '../../model/transactions';
import moment from 'moment/moment';
import { ApiService } from '../../../core/api.service';
import { DropDownType } from '../../../data/shared.data';
import { DataService } from '../../service/data.service';
import {
  Account,
  TransactionCategory,
  TransactionSubCategory,
} from '../../model/common';

export interface TransactionUpdateDialogData {
  formData: TransactionExpand;
  mergeIds: number[] | null;
  task: string;
}

@Component({
  selector: 'app-transaction-update',
  templateUrl: './transaction-update.component.html',
  styleUrl: './transaction-update.component.css',
})
export class TransactionUpdateDialog implements OnInit {
  EXPENSE_SUB_CATEGORIES: TransactionSubCategory[] = [];
  TRANSACTION_TYPES: DropDownType[] = TRANSACTION_TYPES;

  apiService = inject(ApiService);
  dataService = inject(DataService);

  ACCOUNTS: Account[] = this.dataService.getClientSettings().accounts;
  TRANSACTION_CATEGORIES: TransactionCategory[] =
    this.dataService.getTransactionCategories();
  TRANSACTION_SUB_CATEGORIES: TransactionSubCategory[] =
    this.dataService.getTransactionSubCategories();
  INCOME_CATEGORIES = this.dataService.getIncomeCategories();
  PAYMENT_CATEGORIES = this.dataService.getPaymentCategories();
  SAVINGS_CATEGORIES = this.dataService.getSavingsCategories();
  transactionCategories: TransactionCategory[] = [];
  transactionSubCategories: TransactionSubCategory[] = [];

  constructor(
    public dialogRef: MatDialogRef<TransactionUpdateDialog>,
    @Inject(MAT_DIALOG_DATA) public data: TransactionUpdateDialogData,
  ) {}

  transactionForm: FormGroup;
  formData: TransactionExpand;

  ngOnInit(): void {
    if (
      this.data.task == 'edit' ||
      this.data.task == 'merge' ||
      this.data.task == 'delete'
    ) {
      this.formData = this.data.formData!;
      this.transactionForm = this.getNewTransactionForm(this.formData);
    } else if (this.data.task == 'add') {
      this.transactionForm = this.getNewTransactionForm(null);
    }

    const transactionType = this.transactionForm.get('transaction_type')?.value;
    this.setTransactionCategoriesAndSubCategories(transactionType);
    this.transactionForm.get('category')?.valueChanges.subscribe((value) => {
      if (value) {
        this.transactionSubCategories = this.TRANSACTION_SUB_CATEGORIES.filter(
          (x) => x.category === value,
        );
      }
    });

    this.transactionForm
      .get('transaction_type')
      ?.valueChanges.subscribe((value) => {
        this.setTransactionCategoriesAndSubCategories(value);
      });
  }

  private setTransactionCategoriesAndSubCategories(transactionType: number) {
    this.transactionForm.get('subcategory')?.setValue(null);
    this.transactionForm.get('category')?.setValue(null);
    if (transactionType === TRANSACTION_TYPE_EXPENSE_ID) {
      this.transactionCategories = this.TRANSACTION_CATEGORIES;
      this.transactionForm.get('is_payment')?.setValue(false);
      this.transactionForm.get('is_saving')?.setValue(false);
      this.transactionForm.get('is_expense')?.setValue(true);
      this.transactionForm.get('is_income')?.setValue(false);
    } else if (transactionType === TRANSACTION_TYPE_INCOME_ID) {
      this.transactionCategories = this.INCOME_CATEGORIES;
      this.transactionForm.get('is_expense')?.setValue(false);
      this.transactionForm.get('is_payment')?.setValue(false);
      this.transactionForm.get('is_saving')?.setValue(false);
      this.transactionForm.get('is_income')?.setValue(true);
    } else if (transactionType === TRANSACTION_TYPE_SAVINGS_ID) {
      this.transactionCategories = this.SAVINGS_CATEGORIES;
      this.transactionForm.get('is_expense')?.setValue(true);
      this.transactionForm.get('is_payment')?.setValue(false);
      this.transactionForm.get('is_saving')?.setValue(true);
      this.transactionForm.get('is_income')?.setValue(false);
    } else if (transactionType === TRANSACTION_TYPE_PAYMENTS_ID) {
      this.transactionCategories = [
        ...this.PAYMENT_CATEGORIES,
        ...this.TRANSACTION_CATEGORIES,
      ];
      this.transactionForm.get('is_expense')?.setValue(true);
      this.transactionForm.get('is_payment')?.setValue(true);
      this.transactionForm.get('is_saving')?.setValue(false);
      this.transactionForm.get('is_income')?.setValue(false);
    }
  }

  submit() {
    this.transactionForm.value.date = moment(
      this.transactionForm.value.date,
    ).format('YYYY-MM-DD');
    this.transactionForm.value.amount = Number(
      this.transactionForm.value.amount,
    );

    if (
      this.data.task == 'edit' ||
      this.data.task == 'add' ||
      this.data.task == 'delete'
    ) {
      const payload: TransactionRequest = this.transactionForm.value;
      this.apiService
        .updateTransaction(payload)
        .subscribe((transaction: TransactionExpand) => {
          if (transaction) {
            this.dialogRef.close({
              refresh: true,
              data: transaction,
              action: SUCCESS_ACTION,
            });
          } else {
            this.dialogRef.close({
              refresh: false,
              data: null,
              action: ERROR_ACTION,
            });
          }
        });
    } else if (this.data.task == 'merge') {
      const data = this.transactionForm.value;
      const payload: TransactionMergeRequest = {
        ...data,
        merge_ids: this.data.mergeIds,
      };
      this.apiService
        .mergeTransaction(payload)
        .subscribe((transaction: TransactionExpand) => {
          if (transaction) {
            this.dialogRef.close({
              refresh: true,
              data: transaction,
              action: SUCCESS_ACTION,
            });
          } else {
            this.dialogRef.close({
              refresh: false,
              data: null,
              action: ERROR_ACTION,
            });
          }
        });
    }
  }

  cancel() {
    this.dialogRef.close({ refresh: false, data: null, action: CANCEL_ACTION });
  }

  getNewTransactionForm(data: TransactionExpand | null) {
    let transactionType = null;
    if (data) {
      if (data.is_payment) {
        transactionType = TRANSACTION_TYPE_PAYMENTS_ID;
      } else if (data.is_saving) {
        transactionType = TRANSACTION_TYPE_SAVINGS_ID;
      } else if (data.is_income) {
        transactionType = TRANSACTION_TYPE_INCOME_ID;
      } else {
        transactionType = TRANSACTION_TYPE_EXPENSE_ID;
      }
    }
    return new FormGroup({
      id: new FormControl<number | null>(data ? data.id : null),
      category: new FormControl<number | null>(data ? data.category : null, [
        Validators.required,
      ]),
      subcategory: new FormControl<number | null>(
        data ? data.subcategory : null,
        [Validators.required],
      ),
      account: new FormControl<number | null>(data ? data.account : null, [
        Validators.required,
      ]),
      amount: new FormControl<number | null>(data ? data.amount : null, [
        Validators.required,
      ]),
      date: new FormControl<string | null>(data ? data.date : null, [
        Validators.required,
      ]),
      destination: new FormControl<string | null>(
        data ? data.destination : null,
        [Validators.required],
      ),
      alias: new FormControl<string | null>(data ? data.alias : null),
      notes: new FormControl<string | null>(data ? data.notes : null),
      transaction_type: new FormControl<number | null>(
        data ? transactionType : null,
        [Validators.required],
      ),
      update_similar: new FormControl<boolean>(false),
      is_payment: new FormControl<boolean>(data ? data.is_payment : false),
      is_income: new FormControl<boolean>(data ? data.is_income : false),
      is_saving: new FormControl<boolean>(data ? data.is_saving : false),
      is_expense: new FormControl<boolean>(data ? data.is_expense : true),
      is_deleted: new FormControl<boolean>(data ? data.is_deleted : false),
      is_merge: new FormControl<boolean>(data ? data.is_merge : false),
      merge_id: new FormControl<number | null>(data ? data.merge_id : null),
      delete_reason: new FormControl<string | null>(
        data ? data.delete_reason : null,
      ),
      source: new FormControl<number | null>(data ? data.source : 2),
    });
  }
}

@Component({
  selector: 'app-transaction-delete',
  templateUrl: './transaction-delete.component.html',
  styleUrl: './transaction-delete.component.css',
})
export class TransactionDeleteDialog extends TransactionUpdateDialog {
  deleteReason: string = '';

  confirm() {
    this.transactionForm.get('is_deleted')?.setValue(true);
    this.transactionForm.get('delete_reason')?.setValue(this.deleteReason);
    this.submit();
  }
}
