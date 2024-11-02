import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
  MAT_DIALOG_DEFAULT_OPTIONS, MatDialogConfig,
} from '@angular/material/dialog';
import { Transaction } from '../../../model/transactions';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatTabGroup, MatTab } from '@angular/material/tabs';
import { CdkScrollable } from '@angular/cdk/scrolling';

export interface TransactionViewMoreDialogData {
  transaction: Transaction;
}

@Component({
  selector: 'app-view-more',
  templateUrl: './view-more.component.html',
  styleUrl: './view-more.component.css',
  standalone: true,
  imports: [
    MatDialogTitle,
    CdkScrollable,
    MatDialogContent,
    MatTabGroup,
    MatTab,
    MatCard,
    MatCardContent,
    MatDialogActions,
    MatButton,
    MatDialogClose,
  ],
  providers: [
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: {
        width: '900px',
        position: {
          top: '5%',
        },
      } as MatDialogConfig,
    },
  ],
})
export class TransactionViewMoreDialog {
  constructor(
    public dialogRef: MatDialogRef<TransactionViewMoreDialog>,
    @Inject(MAT_DIALOG_DATA) public data: TransactionViewMoreDialogData,
  ) {}
}
