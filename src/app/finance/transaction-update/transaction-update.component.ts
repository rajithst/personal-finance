import {Component, inject, Inject, OnInit} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
  SessionService,
} from '../service/session.service';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';

import {
  DropDownType,
  TRANSACTION_TYPES,
  TRANSACTION_CATEGORIES,
  TRANSACTION_SUB_CATEGORIES,
  PAYMENT_METHODS,
  SAVINGS_CATEGORY_ID,

} from '../../data/client.data';
import { TransactionExpand, TransactionRequest } from '../model/transactions';
import moment from 'moment/moment';
import {map, Observable, startWith} from "rxjs";
import {ApiService} from "../../core/api.service";

export interface TransactionUpdateDialogData {
  formData: TransactionExpand | null;
  formDataList: TransactionExpand[] | null;
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
  sessionService = inject(SessionService);
  apiService = inject(ApiService)

  constructor(
    public dialogRef: MatDialogRef<TransactionUpdateDialog>,
    @Inject(MAT_DIALOG_DATA) public data: TransactionUpdateDialogData,
  ) {}
  sessionData = this.sessionService.getData();
  transactionForm: FormGroup;
  filteredDestinations: Observable<string[]>;
  destinations: string[] = this.sessionData.destinations
  headerTitle: string = '';

  ngOnInit(): void {
    let formData = this.data.formData;
    this.headerTitle =
      this.data.task == 'add'
        ? 'Create Transaction'
        : `Update Transaction (${this.data.formData?.id})`;
    if (formData) {
      this.transactionForm = this.getNewTransactionForm(formData);
    } else {
      this.transactionForm = this.getEmptyTransactionForm();
    }

    this.EXPENSE_SUB_CATEGORIES =
      TRANSACTION_SUB_CATEGORIES[formData?.category!];

    this.transactionForm.get('category')?.valueChanges.subscribe((value) => {
      if (value) {
        this.EXPENSE_SUB_CATEGORIES = TRANSACTION_SUB_CATEGORIES[value];
        this.transactionForm.get('is_saving')?.setValue(value === SAVINGS_CATEGORY_ID)
      }
    });

    this.transactionForm.get('transaction_type')?.valueChanges.subscribe((value) => {
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

    // @ts-ignore
    this.filteredDestinations = this.transactionForm.get('alias')?.valueChanges.pipe(
      startWith(''),
      map((alias: string | null) => this._filter(alias || ''))
    )
  }

  submit() {
    this.transactionForm.value.date = moment(
      this.transactionForm.value.date,
    ).format('YYYY-MM-DD');
    const payload: TransactionRequest = this.transactionForm.value;
    this.apiService.updateTransaction(payload).subscribe((transaction: TransactionExpand) => {
      if (transaction) {
        const updatedData = this.sessionService.syncSessionTransaction(transaction, 'expenses');
        this.dialogRef.close(updatedData)
      } else {
        this.dialogRef.close(null)
      }
    });
  }

  cancel() {
    this.dialogRef.close(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.destinations.filter((option: string) => option.toLowerCase().includes(filterValue));
  }

  getNewTransactionForm(data: TransactionExpand) {
    return new FormGroup({
      id: new FormControl(data.id),
      category: new FormControl(data.category),
      subcategory: new FormControl(data.subcategory),
      payment_method: new FormControl(data.payment_method),
      amount: new FormControl(data.amount),
      date: new FormControl(data.date),
      destination: new FormControl(data.destination),
      alias: new FormControl(data.alias),
      notes: new FormControl(data.notes),
      transaction_type: new FormControl(data.is_payment ? 3 : data.is_expense ? 2 : 1),
      update_similar: new FormControl(false),
      is_payment: new FormControl(data.is_payment),
      is_saving: new FormControl(data.is_saving),
      is_expense: new FormControl(data.is_expense),
      is_deleted: new FormControl(data.is_deleted),
      is_merge: new FormControl(data.is_merge),
      merge_id: new FormControl(data.merge_id),
      is_regular_destination: new FormControl(false),
      delete_reason: new FormControl(data.delete_reason),
    });
  }

  getEmptyTransactionForm() {
    return new FormGroup({
      id: new FormControl(null),
      category: new FormControl(null),
      subcategory: new FormControl(null),
      payment_method: new FormControl(null),
      amount: new FormControl(null),
      date: new FormControl(''),
      destination: new FormControl(''),
      alias: new FormControl(''),
      notes: new FormControl(''),
      update_similar: new FormControl(false),
      transaction_type: new FormControl(2),
      is_payment: new FormControl(false),
      is_saving: new FormControl(false),
      is_expense: new FormControl(true),
      is_deleted: new FormControl(false),
      is_merge: new FormControl(false),
      merge_id: new FormControl(null),
      is_regular_destination: new FormControl(false),
      delete_reason: new FormControl(''),
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

  override cancel() {
    this.dialogRef.close({ refresh: false, data: null });
  }

  confirm() {
    this.transactionForm.get('is_deleted')?.setValue(true);
    this.transactionForm.get('delete_reason')?.setValue(this.deleteReason);
    this.submit();
  }
}
