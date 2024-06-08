import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output, ViewChild,
} from '@angular/core';
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
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";

@Component({
  selector: 'app-transaction-table',
  templateUrl: './transaction-table.component.html',
  styleUrl: './transaction-table.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionTableComponent implements OnChanges, AfterViewChecked {
  @Input() transactions: MonthlyTransaction;
  @Output() tableRendered: EventEmitter<void> = new EventEmitter<void>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  transactionData: MonthlyTransaction;
  dataSource: MatTableDataSource<TransactionExpand>;
  selectedTransactions: Record<string, number[]> = {};
  selectedMonths: number[] = [];
  checkAllItems: boolean = false;

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
  ) {

  }
  ngOnChanges() {
    this.transactionData = this.transactions;
    this.dataSource = new MatTableDataSource<TransactionExpand>([]);
    this.dataSource.sort = this.sort;

  }

  ngAfterViewChecked(): void {
    this.tableRendered.emit();
  }

  editRecord(item: TransactionExpand, task: string) {
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

  deleteRecord(item: TransactionExpand, task: string) {
    const dialog = this.dialog.open(TransactionDeleteDialog, {
      width: '850px',
      position: {
        top: '50px',
      },
      data: { formData: item, task: task },
    });
    dialog.afterClosed().subscribe((result) => {
      if (result.refresh) {
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
    this.dataSource = new MatTableDataSource<TransactionExpand>(this.transactionData.transactions_cp);
  }
}
