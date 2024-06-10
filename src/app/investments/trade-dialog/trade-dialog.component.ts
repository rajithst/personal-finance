import { Component, Inject } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { StockPurchase } from '../model/transaction';
import { FormControl, FormGroup } from '@angular/forms';
import moment from 'moment/moment';
import {SessionService} from "../service/session.service";

export interface TradeDialogData {
  formData: StockPurchase | null;
  task: string;
}
@Component({
  selector: 'app-trade-dialog',
  templateUrl: './trade-dialog.component.html',
  styleUrl: './trade-dialog.component.css',
})
export class TradeDialogComponent {
  private sessionData = this.sessionService.getData();

  constructor(
    private sessionService: SessionService,
    public dialogRef: MatDialogRef<TradeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TradeDialogData,
  ) {}

  transactionForm = this.getNewTransactionForm();
  COMPANIES: any[] = this.sessionData.companies

  private getNewTransactionForm() {
    return new FormGroup({
      id: new FormControl<number | null>(null),
      company: new FormControl<string>(''),
      purchase_date: new FormControl<string>(''),
      quantity: new FormControl<number | null>(null),
      purchase_price: new FormControl<number | null>(null),
      notes: new FormControl<string>(''),
    });
  }

  fillTransactionForm(formData: StockPurchase) {
    return {
      id: formData.id,
      company:  formData.company,
      purchase_date: formData.purchase_date,
      quantity: Number(formData.quantity),
      purchase_price: Number(formData.purchase_price),
      notes: formData.notes
    };
  }

  cancel() {}

  submit() {
    this.transactionForm.value.purchase_date = moment(
      this.transactionForm.value.purchase_date,
    ).format('YYYY-MM-DD');
    const formVals = this.transactionForm.value;
    const payload: StockPurchase = this.fillTransactionForm(
      this.transactionForm.value as StockPurchase,
    );

  }
}
