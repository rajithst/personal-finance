import {Component, Inject, OnInit, signal} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { SessionEventMessage, SessionService } from '../../core/session.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DropDownType } from '../../shared/interface/common.data';
import {
  TRANSACTION_CATEGORIES,
  TRANSACTION_SUB_CATEGORIES,
  PAYMENT_METHODS,
  SAVING_CATEGORIES,
  SAVINGS_CATEGORY_ID,
  NA_CATEGORY_ID,
  NA_SUB_CATEGORY_ID
} from '../../shared/static/client_data';
import moment from 'moment';
import {Transaction, TransactionRequest} from "../../shared/interface/transactions";

export interface TransactionUpdateDialogData {
  formData: Transaction | null;
  task: string
}

@Component({
  selector: 'app-transaction-update',
  templateUrl: './transaction-update.component.html',
  styleUrl: './transaction-update.component.css'
})
export class TransactionUpdateDialog implements OnInit {

  private message =  this.sessionService.getEventMessage();
  PAYMENT_METHODS: DropDownType[] = PAYMENT_METHODS;
  TRANSACTION_CATEGORIES: DropDownType[] = TRANSACTION_CATEGORIES;
  EXPENSE_SUB_CATEGORIES:  DropDownType[] = [];

  expenseForm = new FormGroup({
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
  })


  constructor(
    private formBuilder: FormBuilder,
    private sessionService: SessionService,
    public dialogRef: MatDialogRef<TransactionUpdateDialog>,
    @Inject(MAT_DIALOG_DATA) public data: TransactionUpdateDialogData) {}

  ngOnInit(): void {
    const formData = this.data.formData;
    if (formData) {
    this.expenseForm.setValue({
      id: formData.id,
      category: formData.category,
      subcategory: formData.subcategory,
      payment_method: formData.payment_method,
      destination: formData.destination,
      alias: formData.alias,
      amount: formData.amount,
      date: formData.date,
      notes: formData.notes,
      update_similar: true,
      is_saving: formData.is_saving,
      is_expense: formData.is_expense,
      is_payment: formData.is_payment
      })
    }

    this.EXPENSE_SUB_CATEGORIES = TRANSACTION_SUB_CATEGORIES[formData?.category!];


    this.expenseForm.get('category')?.valueChanges.subscribe(value => {
      if (value) {
        this.EXPENSE_SUB_CATEGORIES = TRANSACTION_SUB_CATEGORIES[value];
      }
    });
    this.expenseForm.get('is_saving')?.valueChanges.subscribe(value => {
      if (value) {
        this.expenseForm.get('category')?.setValue(SAVINGS_CATEGORY_ID);
        this.EXPENSE_SUB_CATEGORIES = TRANSACTION_SUB_CATEGORIES[SAVINGS_CATEGORY_ID];
      } else {
        this.EXPENSE_SUB_CATEGORIES = TRANSACTION_SUB_CATEGORIES[this.expenseForm.get('category')?.value ||  NA_SUB_CATEGORY_ID]
      }
    });
  }


  submit() {
    this.expenseForm.value.date = moment(this.expenseForm.value.date).format('YYYY-MM-DD');
    const formVals = this.expenseForm.value;
    const payload: TransactionRequest = {
      id: formVals.id!,
      category: formVals.category!,
      subcategory: formVals.subcategory!,
      payment_method: formVals.payment_method!,
      alias: formVals.alias!,
      destination: formVals.destination!,
      amount: Number(formVals.amount!),
      date: formVals.date!,
      notes: formVals.notes!,
      update_similar: formVals.update_similar!,
      is_saving: formVals.is_saving!,
      is_expense: formVals.is_expense!,
      is_payment: formVals.is_payment!,
      is_deleted: this.data.task == 'delete'
    };
    this.sessionService.updateTransaction(payload);
    this.message.subscribe((msg: SessionEventMessage)  => {
      if (msg === SessionEventMessage.SESSION_TRANSACTION_UPDATE_SUCCESS) {
        this.dialogRef.close({'refresh': true})
      }
    })
  }

  cancel() {
    this.dialogRef.close({'refresh': false, data: null})
  }

}
