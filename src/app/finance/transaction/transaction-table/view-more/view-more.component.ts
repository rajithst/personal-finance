import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Transaction} from "../../../../model/transactions";

export interface TransactionViewMoreDialogData {
  transaction: Transaction;
}

@Component({
  selector: 'app-view-more',
  templateUrl: './view-more.component.html',
  styleUrl: './view-more.component.css'
})
export class TransactionViewMoreDialog {

  constructor(
    public dialogRef: MatDialogRef<TransactionViewMoreDialog>,
    @Inject(MAT_DIALOG_DATA) public data: TransactionViewMoreDialogData,
  ) {}
}
