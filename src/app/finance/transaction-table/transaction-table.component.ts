import { Component, Input, OnChanges, OnInit } from '@angular/core';
import {
  MonthlyTransaction,
  Transaction,
} from '../model/transactions';
import { TransactionUpdateDialog } from '../transaction-update/transaction-update.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-transaction-table',
  templateUrl: './transaction-table.component.html',
  styleUrl: './transaction-table.component.css',
})
export class TransactionTableComponent implements OnChanges {
  @Input() transactions!: MonthlyTransaction[];
  transactionData: MonthlyTransaction[] = [];
  selectedTransactions: number[] = [];

  constructor(private dialog: MatDialog) {}
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
  }

  toggleItem(id: number | null, event: any) {
    if (event.target.checked) {

    }
  }
}
