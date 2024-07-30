import { Component, inject, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import {
  TRANSACTION_TYPES,
  TRANSACTION_CATEGORIES,
  TRANSACTION_SUB_CATEGORIES,
  PAYMENT_METHODS,
  SAVINGS_CATEGORY_ID,
} from '../../../data/client.data';
import {
  TransactionExpand,
  TransactionMergeRequest,
  TransactionRequest,
} from '../../model/transactions';
import moment from 'moment/moment';
import { ApiService } from '../../../core/api.service';
import { DropDownType } from '../../../data/shared.data';

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
  PAYMENT_METHODS: DropDownType[] = PAYMENT_METHODS;
  TRANSACTION_CATEGORIES: DropDownType[] = TRANSACTION_CATEGORIES;
  EXPENSE_SUB_CATEGORIES: DropDownType[] = [];
  TRANSACTION_TYPES: DropDownType[] = TRANSACTION_TYPES;

  apiService = inject(ApiService);

  constructor(
    public dialogRef: MatDialogRef<TransactionUpdateDialog>,
    @Inject(MAT_DIALOG_DATA) public data: TransactionUpdateDialogData,
  ) {}

  transactionForm: FormGroup;
  formData: TransactionExpand;

  ngOnInit(): void {
    if (this.data.task == 'edit' || this.data.task == 'merge' || this.data.task == 'delete') {
      this.formData = this.data.formData!;
      this.transactionForm = this.getNewTransactionForm(this.formData);
    } else if (this.data.task == 'add') {
      this.transactionForm = this.getNewTransactionForm(null);
    }

    this.EXPENSE_SUB_CATEGORIES =
      TRANSACTION_SUB_CATEGORIES[this.formData?.category!];

    this.transactionForm.get('category')?.valueChanges.subscribe((value) => {
      if (value) {
        this.EXPENSE_SUB_CATEGORIES = TRANSACTION_SUB_CATEGORIES[value];
        this.transactionForm
          .get('is_saving')
          ?.setValue(value === SAVINGS_CATEGORY_ID);
      }
    });

    this.transactionForm
      .get('transaction_type')
      ?.valueChanges.subscribe((value) => {
        if (value == 2) {
          this.transactionForm.get('is_expense')?.setValue(true);
          this.transactionForm.get('is_saving')?.setValue(false);
          this.transactionForm.get('is_payment')?.setValue(false);
        } else if (value == 3) {
          this.transactionForm.get('is_payment')?.setValue(true);
          this.transactionForm.get('is_expense')?.setValue(true);
          this.transactionForm.get('is_saving')?.setValue(false);
        }
      });
  }

  submit() {
    this.transactionForm.value.date = moment(
      this.transactionForm.value.date,
    ).format('YYYY-MM-DD');

    if (this.data.task == 'edit' || this.data.task == 'add' || this.data.task == 'delete') {
      const payload: TransactionRequest = this.transactionForm.value;
      this.apiService
        .updateTransaction(payload)
        .subscribe((transaction: TransactionExpand) => {
          if (transaction) {
            this.dialogRef.close(transaction);
          } else {
            this.dialogRef.close(null);
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
            this.dialogRef.close(transaction);
          } else {
            this.dialogRef.close(null);
          }
        });
    }
  }

  cancel() {
    this.dialogRef.close(null);
  }

  getNewTransactionForm(data: TransactionExpand | null) {
    return new FormGroup({
      id: new FormControl(data ? data.id : null),
      category: new FormControl(data ? data.category : null),
      subcategory: new FormControl(data ? data.subcategory : null),
      payment_method: new FormControl(data ? data.payment_method : null),
      amount: new FormControl(data ? data.amount : null),
      date: new FormControl(data ? data.date : null),
      destination: new FormControl(data ? data.destination : null),
      alias: new FormControl(data ? data.alias : null),
      notes: new FormControl(data ? data.notes : null),
      transaction_type: new FormControl(
        data ? (data.is_payment ? 3 : data.is_expense ? 2 : 1) : 2,
      ),
      update_similar: new FormControl(false),
      is_payment: new FormControl(data ? data.is_payment : false),
      is_saving: new FormControl(data ? data.is_saving : false),
      is_expense: new FormControl(data ? data.is_expense : true),
      is_deleted: new FormControl(data ? data.is_deleted : false),
      is_merge: new FormControl(data ? data.is_merge : false),
      merge_id: new FormControl(data ? data.merge_id : null),
      delete_reason: new FormControl(data ? data.delete_reason : null),
      source: new FormControl(data ? data.source : 2)
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
