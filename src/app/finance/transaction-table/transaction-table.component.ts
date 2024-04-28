import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { MonthlyTransaction, Transaction } from '../model/transactions';
import { TransactionUpdateDialog } from '../transaction-update/transaction-update.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-transaction-table',
  templateUrl: './transaction-table.component.html',
  styleUrl: './transaction-table.component.css',
})
export class TransactionTableComponent implements OnChanges {
  @Input() transactions!: MonthlyTransaction[];
  transactionData: MonthlyTransaction[] = [];
  selectedTransactions: number[] = [];

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {}
  ngOnChanges() {
    this.transactionData = this.transactions;
  }

  editRecord(item: Transaction, task: string) {
    item.update_similar = true;
    item.is_regular_destination = true;
    item.is_deleted = task === 'delete';
    const dialog = this.dialog.open(TransactionUpdateDialog, {
      width: '850px',
      position: {
        top: '50px',
      },
      data: { formData: item, task: task },
    });
    dialog.afterClosed().subscribe((result) => {
      if (result.refresh) {
        this.snackBar.open('Updated!', 'Success', {
          duration: 3000,
        });
      }
    });
  }

  toggleItem(id: number | null, event: any) {
    if (event.target.checked) {
    }
  }
}
