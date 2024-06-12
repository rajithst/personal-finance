import { Component, inject, Input, OnChanges, ViewChild } from '@angular/core';
import {
  MonthlyTransaction,
  Transaction,
  TransactionExpand,
} from '../model/transactions';
import {
  TransactionDeleteDialog,
  TransactionUpdateDialog,
} from '../transaction-update/transaction-update.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  faList,
  faEllipsis,
  faTrash,
  faEdit,
  faScissors,
  faEllipsisV,
} from '@fortawesome/free-solid-svg-icons';
import { TransactionDetailDialog } from '../transaction-detail/transaction-detail.component';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SessionService } from '../service/session.service';

@Component({
  selector: 'app-transaction-table',
  templateUrl: './transaction-table.component.html',
  styleUrl: './transaction-table.component.css',
})
export class TransactionTableComponent implements OnChanges {
  @Input() transactions: MonthlyTransaction;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<TransactionExpand>;

  sessionService = inject(SessionService);
  transactionData: MonthlyTransaction;
  dataSource: MatTableDataSource<TransactionExpand>;
  selectedTransactions: Record<string, number[]> = {};
  selectedMonths: number[] = [];
  checkAllItems: boolean = false;
  totalCost: number = 0;

  protected readonly faEllipsis = faEllipsis;
  protected readonly faTrash = faTrash;
  protected readonly faEdit = faEdit;
  protected readonly faList = faList;
  protected readonly faScissors = faScissors;
  protected readonly faEllipsisV = faEllipsisV;

  displayedColumns: string[] = [
    'select',
    'Date',
    'PaymentMethod',
    'Destination',
    'Category',
    'SubCategory',
    'Amount',
    'Notes',
    'Actions',
  ];

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {}

  ngOnChanges() {
    this.transactionData = this.transactions;
    console.log(this.transactionData);
    this.totalCost = this.transactionData.total;
    this.dataSource = new MatTableDataSource<TransactionExpand>([]);
    this.dataSource.sort = this.sort;
  }

  editRecord(item: TransactionExpand, task: string) {
    const dialog = this.dialog.open(TransactionUpdateDialog, {
      width: '850px',
      position: {
        top: '70px',
      },
      data: { formData: item, task: task },
    });

    dialog.afterClosed().subscribe((result: MonthlyTransaction | null) => {
      if (result) {
        this.totalCost = result.total;
        this.dataSource.data = result.transactions_cp;
        this.snackBar.open('Updated!', 'Success', {
          duration: 3000,
        });
      }
    });
  }

  deleteRecord(item: TransactionExpand, task: string) {
    const dialog = this.dialog.open(TransactionDeleteDialog, {
      width: '850px',
      position: {
        top: '50px',
      },
      data: { formData: item, task: task },
    });
    dialog.afterClosed().subscribe((result) => {
      if (result) {
        this.totalCost = result.total;
        this.dataSource.data = result.transactions_cp;
        this.snackBar.open('Deleted!', 'Success', {
          duration: 3000,
        });
      }
    });
  }

  showMergeTransactions(row: Transaction) {
    this.dialog.open(TransactionDetailDialog, {
      width: '850px',
      position: {
        top: '50px',
      },
      data: {},
    });
  }

  panelOpened() {
    this.dataSource = new MatTableDataSource<TransactionExpand>(
      this.transactionData.transactions_cp,
    );
    this.table.renderRows();
  }
}
