import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';

export interface TransactionDetailDialogData {}

@Component({
  selector: 'app-transaction-detail',
  templateUrl: './transaction-detail.component.html',
  styleUrl: './transaction-detail.component.css',
})
export class TransactionDetailDialog {
  constructor(
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<TransactionDetailDialog>,
    @Inject(MAT_DIALOG_DATA) public data: TransactionDetailDialogData,
  ) {}

  close() {}
}
