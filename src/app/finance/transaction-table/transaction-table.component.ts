import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,

} from '@angular/core';
import { MonthlyTransaction, Transaction } from '../model/transactions';
import {
  TransactionUpdateDialog,
} from '../transaction-update/transaction-update.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import {faGear, faCodeMerge, faList, faCircleCheck} from '@fortawesome/free-solid-svg-icons';
import {TransactionDetailDialog} from "../transaction-detail/transaction-detail.component";

@Component({
  selector: 'app-transaction-table',
  templateUrl: './transaction-table.component.html',
  styleUrl: './transaction-table.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionTableComponent implements OnChanges {
  @Input() transactions: MonthlyTransaction[] = [];
  transactionData: MonthlyTransaction[] = [];
  selectedTransactions: Record<string, number[]> = {};
  selectedMonths: number[] = [];
  checkAllItems: boolean = false;
  protected readonly faGeorIcon = faGear;
  protected readonly faMergeIcon = faCodeMerge;
  protected readonly faListIcon = faList;
  protected readonly faCircleCheck = faCircleCheck;

  displayedColumns: string[] = ['select', 'Date', 'Category', 'SubCategory', 'PaymentMethod', 'Amount', 'PaymentMethod', 'Destination', 'Actions'];

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {}
  ngOnChanges() {
    this.transactionData = this.transactions;
    this.prepareSelectedTransactions()
  }

  editRecord(item: Transaction, task: string) {
    item.update_similar = false;
    item.is_regular_destination = false;
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

  toggleItem(row: Transaction, $event: any) {
    const isChecked = $event.target.checked;
    const target = this.transactionData
      .find((x) => x.year == row.year && x.month == row.month)
      ?.transactions_cp.find((x) => x.id === row.id);
    if (target) {
      target.checked = isChecked;
    }
    const transactionKey = `${row.year}${row.month}`;
    if (!(transactionKey in this.selectedTransactions)) {
      this.selectedTransactions[transactionKey] = []
    }

    if (isChecked) {
      this.selectedTransactions[transactionKey].push(row.id!);
    } else {
      this.selectedTransactions[transactionKey] = this.selectedTransactions[transactionKey].filter(
        (x) => x !== row.id,
      );
    }
  }

  toggleAll($event: any, rowYear: number, rowMonth: number) {
    const isChecked = $event.target.checked;
    const rowIds: number[] = [];
    this.transactionData
      .find((x) => x.year == rowYear && x.month == rowMonth)
      ?.transactions_cp.forEach((x) => {
        x.checked = isChecked;
        rowIds.push(x.id!);
      });
    this.selectedTransactions[`${rowYear}${rowMonth}`] = rowIds;
  }

  mergeTransactions() {
    const dialog = this.dialog.open(TransactionUpdateDialog, {
      width: '850px',
      position: {
        top: '50px',
      },
      data: { formData: null, formDataList: this.getCheckedTransactions(), task: 'merge' },
    });
    dialog.afterClosed().subscribe((result) => {
      if (result.refresh) {
        this.snackBar.open('Updated!', 'Success', {
          duration: 3000,
        });
      }
    });
  }

  getCheckedTransactions() {
    const results = this.transactionData
      .map((month) => month.transactions)
      .flatMap((transaction) => transaction.filter((x) => x.checked));

    results.forEach(x => {
      x.update_similar = false;
      x.is_regular_destination = false;
    })
    return results;
  }

  prepareSelectedTransactions() {
    const checkedTransactions = this.getCheckedTransactions();
    checkedTransactions.forEach((transaction) => {
      const transactionKey = `${transaction.year}${transaction.month}`;
      if (transactionKey in this.selectedTransactions) {
        this.selectedTransactions[transactionKey].push(transaction.id!)
      } else {
        this.selectedTransactions[transactionKey] = [transaction.id!];
      }
    })
  }

  canMerge(row: Transaction): boolean {
    const transactionKey = `${row.year}${row.month}`;
    if (transactionKey in this.selectedTransactions) {
      return this.selectedTransactions[transactionKey].length > 1 && this.selectedTransactions[transactionKey].includes(row.id!)
    }
    return false;
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

  toggleSelection(element: Transaction) {
    element.checked = !element.checked;
  }
}
