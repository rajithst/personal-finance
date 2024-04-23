import { Component, Inject, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  SessionEventMessage,
  SessionService,
} from '../../core/session.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import {
  DropDownType,
  TRANSACTION_CATEGORIES,
  TRANSACTION_SUB_CATEGORIES,
  PAYMENT_METHODS,
  SAVINGS_CATEGORY_ID,
  NA_SUB_CATEGORY_ID,
} from '../../data/client.data';
import moment from 'moment';
import { Transaction } from '../model/transactions';

export interface TransactionUpdateDialogData {
  formData: Transaction | null;
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

  constructor(
    private sessionService: SessionService,
    public dialogRef: MatDialogRef<TransactionUpdateDialog>,
    @Inject(MAT_DIALOG_DATA) public data: TransactionUpdateDialogData,
  ) {}
  message = this.sessionService.getEventMessage();
  sessionData = this.sessionService.getData();
  transactionForm = this.getNewTransactionForm();
  destinations: string[] = this.sessionData.destinations;

  ngOnInit(): void {
    const formData = this.data.formData;
    if (formData) {
      this.transactionForm.setValue(this.fillTransactionForm(formData));
    }

    this.EXPENSE_SUB_CATEGORIES =
      TRANSACTION_SUB_CATEGORIES[formData?.category!];

    this.transactionForm.get('category')?.valueChanges.subscribe((value) => {
      if (value) {
        this.EXPENSE_SUB_CATEGORIES = TRANSACTION_SUB_CATEGORIES[value];
      }
    });
    this.transactionForm.get('is_saving')?.valueChanges.subscribe((value) => {
      if (value) {
        this.transactionForm.get('category')?.setValue(SAVINGS_CATEGORY_ID);
        this.EXPENSE_SUB_CATEGORIES =
          TRANSACTION_SUB_CATEGORIES[SAVINGS_CATEGORY_ID];
      } else {
        this.EXPENSE_SUB_CATEGORIES =
          TRANSACTION_SUB_CATEGORIES[
            this.transactionForm.get('category')?.value || NA_SUB_CATEGORY_ID
          ];
      }
    });
  }

  submit() {
    this.transactionForm.value.date = moment(
      this.transactionForm.value.date,
    ).format('YYYY-MM-DD');
    const formVals = this.transactionForm.value;
    const payload: Transaction = this.fillTransactionForm(
      this.transactionForm.value as Transaction,
    );
    this.sessionService.updateTransaction(payload);
    this.message.subscribe((msg: SessionEventMessage) => {
      if (msg === SessionEventMessage.SESSION_TRANSACTION_UPDATE_SUCCESS) {
        this.dialogRef.close({ refresh: true });
      }
    });
  }

  cancel() {
    this.dialogRef.close({ refresh: false, data: null });
  }

  getNewTransactionForm() {
    return new FormGroup({
      id: new FormControl<number | null>(null),
      category: new FormControl<number>(0),
      subcategory: new FormControl<number>(0),
      payment_method: new FormControl<number>(0),
      amount: new FormControl<number | null>(null),
      date: new FormControl<string>(''),
      destination: new FormControl<string>(''),
      alias: new FormControl<string>(''),
      notes: new FormControl<string>(''),
      update_similar: new FormControl<boolean>(true),
      is_payment: new FormControl<boolean>(false),
      is_saving: new FormControl<boolean>(false),
      is_expense: new FormControl<boolean>(false),
      is_deleted: new FormControl<boolean>(false),
      is_regular_destination: new FormControl<boolean>(true),
      delete_reason: new FormControl<string>(''),
    });
  }

  fillTransactionForm(formData: Transaction) {
    return {
      id: formData.id,
      category: formData.category,
      subcategory: formData.subcategory,
      payment_method: formData.payment_method,
      destination: formData.destination,
      alias: formData.alias,
      amount: Number(formData.amount),
      date: formData.date,
      notes: formData.notes,
      update_similar: formData.update_similar,
      is_saving: formData.is_saving,
      is_expense: formData.is_expense,
      is_payment: formData.is_payment,
      is_deleted: formData.is_deleted,
      is_regular_destination: formData.is_regular_destination,
      delete_reason: formData.delete_reason,
    };
  }
}
