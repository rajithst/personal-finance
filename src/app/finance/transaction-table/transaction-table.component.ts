import {
  Component,
  inject,
  Input,
  OnChanges,
  OnInit,
  ViewChild
} from '@angular/core';
import {
  MonthlyTransaction,
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
  faTrash,
  faEdit,
  faScissors,
  faEllipsisV,
} from '@fortawesome/free-solid-svg-icons';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SessionService } from '../service/session.service';
import { DataService } from '../service/data.service';


@Component({
  selector: 'app-transaction-table',
  templateUrl: './transaction-table.component.html',
  styleUrl: './transaction-table.component.css',
})
export class TransactionTableComponent implements OnInit, OnChanges {
  @Input() transactions: MonthlyTransaction;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<TransactionExpand>;

  protected readonly faTrash = faTrash;
  protected readonly faEdit = faEdit;
  protected readonly faList = faList;
  protected readonly faScissors = faScissors;
  protected readonly faEllipsisV = faEllipsisV;

  private sessionService = inject(SessionService);
  private dataService = inject(DataService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  transactionData: MonthlyTransaction;
  dataSource: MatTableDataSource<TransactionExpand>;
  totalCost: number = 0;
  isOpen = false;


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

  constructor() {}

  ngOnInit(): void {
    this.dataService.triggerPanels$.subscribe((value) => {
      console.log('panel triggering', value)
      if (value !== null && value) {
        this.dataSource = new MatTableDataSource<TransactionExpand>(
          this.transactionData.transactions_cp,
        );
      }
    });
  }

  ngOnChanges() {
    this.transactionData = this.transactions;
    this.totalCost = this.transactionData.total;
    if (this.isOpen) {
      this.dataSource = new MatTableDataSource<TransactionExpand>(this.transactionData.transactions_cp);
    } else {
      this.dataSource = new MatTableDataSource<TransactionExpand>([]);
    }
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
        const filteredData = this.sessionService.filterTransactions('transactions');
        const target = filteredData.find(
          (x) => x.year === item.year && x.month === item.month,
        );
        if (target) {
          this.transactionData = target;
          this.dataSource = new MatTableDataSource<TransactionExpand>(this.transactionData.transactions_cp);
          this.table.renderRows()
        }
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
        this.transactionData = result;
        this.dataSource = new MatTableDataSource<TransactionExpand>(result.transactions_cp);
        this.snackBar.open('Deleted!', 'Success', {
          duration: 3000,
        });
      }
    });
  }

  panelTrigger() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.dataSource = new MatTableDataSource<TransactionExpand>(
        this.transactionData.transactions_cp
      );
      this.table.renderRows()
    }
  }
}
