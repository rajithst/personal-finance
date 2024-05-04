import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
  SessionEventMessage,
  SessionService,
} from '../service/session.service';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';

import {
  DropDownType,
  TRANSACTION_CATEGORIES,
  TRANSACTION_SUB_CATEGORIES,
  PAYMENT_METHODS,
  SAVINGS_CATEGORY_ID,
  NA_SUB_CATEGORY_ID,
} from '../../data/client.data';
import { Transaction } from '../model/transactions';
import moment from "moment/moment";

export interface TransactionUpdateDialogData {
  formData: Transaction | null;
  formDataList: Transaction[] | null;
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
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<TransactionUpdateDialog>,
    @Inject(MAT_DIALOG_DATA) public data: TransactionUpdateDialogData,
  ) {}
  message = this.sessionService.getEventMessage();
  sessionData = this.sessionService.getData();
  transactionForm = this.getNewTransactionForm();
  destinations: string[] = this.sessionData.destinations;
  headerTitle: string = '';

  ngOnInit(): void {
    let formData = this.data.formData;
    this.headerTitle = this.data.task == "add" ? 'Add Transaction': `Update Transaction (${this.data.formData?.id})`;
    if (this.data.task == 'merge') {
      formData = this.prepareMergeForm()
      this.headerTitle = 'Merge Transactions'
    }
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

  delete() {
    const deleteDialog = this.dialog.open(TransactionDeleteDialog, {
      width: '550px',
      data: this.data,
    });
    deleteDialog.afterClosed().subscribe((result) => {
      if (result.refresh && result.data) {
        this.transactionForm.value.is_deleted = true;
        this.transactionForm.value.delete_reason = result.data;
        this.submit();
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
      is_merge: new FormControl<boolean>(false),
      is_regular_destination: new FormControl<boolean>(true),
      delete_reason: new FormControl<string>(''),
      checked: new FormControl<boolean>(false),
      merged_ids: new FormControl<number[]>([]),
    });
  }

  fillTransactionForm(formData: Transaction): Transaction {
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
      update_similar: formData.update_similar || true,
      is_saving: formData.is_saving,
      is_expense: formData.is_expense,
      is_payment: formData.is_payment,
      is_deleted: formData.is_deleted,
      is_merge: formData.is_merge,
      is_regular_destination: formData.is_regular_destination || true,
      delete_reason: formData.delete_reason,
      checked: formData.checked,
      merged_ids: formData.merged_ids || []
    };
  }

  prepareMergeForm() {
    const totalAmount = this.data.formDataList!.reduce((tot, transaction) => tot + transaction.amount, 0);
    const transactionId = Math.min(...this.data.formDataList!.map(x => x.id!))
    const data = this.fillTransactionForm(this.data.formDataList![0])
    data.id = transactionId;
    data.amount = totalAmount
    data.merged_ids = this.data.formDataList?.map(x => x.id) as number[];
    data.is_merge = true
    return data;
  }
}

@Component({
  selector: 'app-transaction-delete',
  templateUrl: './transaction-delete.component.html',
  styleUrl: './transaction-delete.component.css',
})
export class TransactionDeleteDialog extends TransactionUpdateDialog {
  deleteReason: string = '';

  override cancel() {
    this.dialogRef.close({ refresh: false, data: null });
  }

  confirm() {
    this.dialogRef.close({ refresh: true, data: this.deleteReason });
  }
}

export interface TransactionMergeDialogData {
  transactions: Transaction[];
}

