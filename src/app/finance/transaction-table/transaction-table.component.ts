import {
  Component,
  inject, Input,
  input,
  OnChanges,
  OnInit, signal, viewChild,
  ViewChild,
} from '@angular/core';
import {
  MonthlyTransaction, Transaction,
  TransactionExpand,
} from '../model/transactions';
import {
  TransactionDeleteDialog,
  TransactionUpdateDialog,
} from '../transaction-update/transaction-update.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  faEdit,
  faEllipsisV,
  faList,
  faScissors,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SessionService } from '../service/session.service';
import { DataService } from '../service/data.service';
import { SelectionModel } from '@angular/cdk/collections';
import {MatAccordion} from "@angular/material/expansion";


@Component({
  selector: 'app-transaction-table',
  templateUrl: './transaction-table.component.html',
  styleUrl: './transaction-table.component.css',
})
export class TransactionTableComponent implements OnInit, OnChanges {
  @Input() transactions: MonthlyTransaction[];
  accordion = viewChild.required(MatAccordion);

  protected readonly faTrash = faTrash;
  protected readonly faEdit = faEdit;
  protected readonly faList = faList;
  protected readonly faScissors = faScissors;
  protected readonly faEllipsisV = faEllipsisV;

  private sessionService = inject(SessionService);
  private dataService = inject(DataService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);


  dataSource: MatTableDataSource<TransactionExpand>;
  selection = new SelectionModel<TransactionExpand>(true, []);
  allDataSource: MatTableDataSource<TransactionExpand>[] = [];
  allTransactions: MonthlyTransaction[] = [];
  bulkSelectedTableIndex: number = -1;
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

  ngOnInit(): void {
    this.dataService.expandPanels$.subscribe((value) => {
      if(value) {
        this.accordion().openAll();
      } else {
        this.accordion().closeAll();
      }
    });
  }

  ngOnChanges() {
    this.allTransactions = this.transactions.length > 0 ? this.transactions : [];
    this.allTransactions.forEach((x: MonthlyTransaction, index: number) => {
      this.allDataSource.splice(index, 0, new MatTableDataSource<TransactionExpand>(x.transactions))
    })
  }

  editRecord(item: TransactionExpand, tableIndex: number) {

    const dialog = this.dialog.open(TransactionUpdateDialog, {
      width: '850px',
      position: {
        top: '70px',
      },
      data: { formData: item, task: 'edit' },
    });

    dialog.afterClosed().subscribe((result: TransactionExpand | null) => {
      if (result) {
        const orAmount = item.amount;
        const newAmount = result.amount;
        const tableData = this.allDataSource[tableIndex].data;
        const transactionId = tableData.findIndex((x: TransactionExpand) => x.id == result.id);
        tableData[transactionId] = result;
        this.allTransactions[tableIndex].total += newAmount!-orAmount!
        this.allDataSource.splice(tableIndex, 0, new MatTableDataSource<TransactionExpand>(tableData))
        this.snackBar.open('Updated!', 'Success', {
          duration: 3000,
        });
      }
    });
  }

  deleteRecord(item: TransactionExpand) {
    const dialog = this.dialog.open(TransactionDeleteDialog, {
      width: '850px',
      position: {
        top: '50px',
      },
      data: { formData: item, task: 'delete' },
    });
    dialog.afterClosed().subscribe((result) => {
      if (result) {

      }
    });
  }

  isAllSelected(tableIndex: number) {
    const numSelected = this.selection.selected.length;
    const numRows = this.allDataSource[tableIndex].data.length;
    return numSelected === numRows;
  }

  toggleAllRows(tableIndex: number) {
    if (this.isAllSelected(tableIndex)) {
      this.selection.clear();
      this.bulkSelectedTableIndex = -1;
    } else {
      this.selection.select(...this.allDataSource[tableIndex].data);
      this.bulkSelectedTableIndex = tableIndex;
    }
    this.dataService.setBulkSelectTransactions(this.selection.selected);
  }

  toggleRow(row: TransactionExpand, tableIndex: number) {
    this.selection.toggle(row);
    this.bulkSelectedTableIndex = tableIndex;
    this.dataService.setBulkSelectTransactions(this.selection.selected);
  }

}
