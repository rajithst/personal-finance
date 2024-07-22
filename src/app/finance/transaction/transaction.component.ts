import {
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  viewChild,
} from '@angular/core';
import { LoadingService } from '../../shared/loading/loading.service';
import {
  faCirclePlus,
  faCodeMerge,
  faExpand,
  faFilter,
  faMinimize,
  faPencil,
  faSquareCaretLeft,
  faSquareCaretRight,
  faTrash,
  faUpload,
} from '@fortawesome/free-solid-svg-icons';
import { TransactionUpdateDialog } from '../transaction-update/transaction-update.component';
import { MatDialog } from '@angular/material/dialog';
import { DataService } from '../service/data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TransactionFilterComponent } from '../transaction-filter/transaction-filter.component';
import { map, Observable, ReplaySubject, takeUntil } from 'rxjs';
import {
  MonthlyTransaction,
  TransactionExpand,
  TransactionFilter,
} from '../model/transactions';
import { Title } from '@angular/platform-browser';
import { EXPENSE, INCOME, PAYMENT, SAVING } from '../../data/shared.data';
import { ApiService } from '../../core/api.service';
import { Income, MonthlyIncome } from '../model/income';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrl: './transaction.component.css',
})
export class FinanceComponent implements OnInit, OnDestroy {
  protected readonly faUpload = faUpload;
  protected readonly faMinimize = faMinimize;
  protected readonly faCirclePlus = faCirclePlus;
  protected readonly faFilter = faFilter;
  protected readonly faExpand = faExpand;
  protected readonly faPencil = faPencil;
  protected readonly faTrash = faTrash;
  protected readonly faCodeMerge = faCodeMerge;
  protected readonly faSquareCaretRight = faSquareCaretRight;
  protected readonly faSquareCaretLeft = faSquareCaretLeft;
  protected readonly INCOME = INCOME;
  protected readonly PAYMENT = PAYMENT;
  protected readonly SAVING = SAVING;
  protected readonly EXPENSE = EXPENSE;

  protected readonly destroyed$ = new ReplaySubject<void>(1);
  protected loadingService = inject(LoadingService);
  private dataService = inject(DataService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  title = inject(Title);

  filterButton = viewChild<ElementRef>('filterButton');
  searchInput = viewChild<ElementRef>('searchInput');

  allExpanded = false;
  filterEnabled = false;
  today = new Date();
  currentYear = this.today.getFullYear();
  selectedTransactions: TransactionExpand[] = [];

  constructor() {}

  ngOnInit(): void {
    this.loadingService.loadingOn();
    this.dataService.bulkSelectTransaction$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((value) => {
        this.selectedTransactions = value;
      });
  }

  addTransaction() {
    const dialog = this.dialog.open(TransactionUpdateDialog, {
      width: '850px',
      position: {
        top: '50px',
      },
      data: { formData: null, task: 'add' },
    });
    dialog.afterClosed().subscribe((result) => {
      if (result) {
        //this.dataService.setTransaction(result);
        this.snackBar.open('Updated!', 'Success', {
          duration: 3000,
        });
      }
    });
  }

  openFilters() {
    this.dialog.closeAll();
    const rect = this.filterButton()?.nativeElement.getBoundingClientRect();
    const dialog = this.dialog.open(TransactionFilterComponent, {
      width: '700px',
      height: '500px',
      position: { top: `${rect.bottom + 10}px`, right: `20px` },
      hasBackdrop: true,
    });

    dialog.afterClosed().subscribe((result) => {
      if (result) {
        this.dataService.setFilterParams(result.filters);
        this.dataService.setPanelActions(this.allExpanded);
        //this.filterEnabled = result.filters;
      }
    });
  }

  panelAction() {
    this.allExpanded = !this.allExpanded;
    this.dataService.setPanelActions(this.allExpanded);
  }

  applyFilter() {
    //const filterValue = this.searchInput()?.nativeElement.value;
    //this.dataService.setSearchQuery(filterValue.toLowerCase());
  }

  changeFilterYear(direction: string) {
    this.loadingService.loadingOn();
    if (direction === 'prev') {
      this.currentYear = this.currentYear - 1;
    } else {
      this.currentYear = this.currentYear + 1;
    }
    this.dataService.setFilterYear(this.currentYear);
    this.dataService.clearAllFiltersAndSelections();
  }

  mergeTransactions() {
    const formData = this.selectedTransactions[0];
    formData.amount = this.selectedTransactions.reduce(
      (total, item) => total + (item.amount === null ? 0 : item.amount),
      0,
    );
    const mergeIds = this.selectedTransactions
      .filter((x) => x.id !== formData.id)
      .map((x) => x.id);
    const dialog = this.dialog.open(TransactionUpdateDialog, {
      width: '850px',
      position: {
        top: '10%',
      },
      data: {
        formData: formData,
        task: 'merge',
        mergeIds: mergeIds,
      },
    });
    dialog.afterClosed().subscribe((result: TransactionExpand | null) => {
      if (result) {
        //this.dataService.setBulkSelectTransactions(result);
        this.snackBar.open('Updated!', 'Success', {
          duration: 3000,
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}

@Component({
  selector: 'app-transaction-detail',
  template: '',
  styles: '',
})
export class TransactionDetailComponent implements OnInit, OnDestroy {
  protected apiService = inject(ApiService);
  protected loadingService = inject(LoadingService);
  private dataService = inject(DataService);
  protected readonly destroyed$ = new ReplaySubject<void>(1);
  target: string = EXPENSE;
  data$: Observable<MonthlyTransaction[]>;

  ngOnInit(): void {
    this.extracted({
      target: this.target,
      year: this.dataService.getFilterYear(),
    });
    this.dataService.transactionFilters$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((filters) => {
        if (filters?.target === this.target) {
          this.extracted(filters);
        }
      });
    this.dataService.yearSwitch$.subscribe((year) => {
      this.extracted({ target: this.target, year: year });
    });
  }

  extracted(filters: TransactionFilter) {
    const transactions$ = this.apiService.getTransactions(filters);
    this.data$ = transactions$
      .pipe(takeUntil(this.destroyed$))
      .pipe(map((value) => value.payload));
    this.loadingService.loadingOff();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
    this.dataService.clearAllFiltersAndSelections();
  }
}

@Component({
  selector: 'app-expenses',
  template:
    '<app-transaction-table [transactions]="(data$ | async) ?? []"></app-transaction-table>',
  styles: '',
})
export class ExpensesComponent extends TransactionDetailComponent {
  override target: string = EXPENSE;
}

@Component({
  selector: 'app-payments',
  template:
    '<app-transaction-table [transactions]="(data$ | async) ?? []"></app-transaction-table>',
  styles: '',
})
export class PaymentsComponent extends TransactionDetailComponent {
  override target: string = PAYMENT;
}

@Component({
  selector: 'app-savings',
  template:
    '<app-transaction-table [transactions]="(data$ | async) ?? []"></app-transaction-table>',
  styles: '',
})
export class SavingsComponent extends TransactionDetailComponent {
  override target: string = SAVING;
}

@Component({
  selector: 'app-income',
  template:
    '<app-transaction-table [transactions]="(data$ | async) ?? []"></app-transaction-table>',
  styles: '',
})
export class IncomesComponent extends TransactionDetailComponent {
  override target: string = INCOME;

  override extracted(filters: TransactionFilter) {
    const transactions$ = this.apiService.getIncome(filters);
    this.data$ = transactions$
      .pipe(takeUntil(this.destroyed$))
      .pipe(map((value) => value.payload))
      .pipe(map((payload) => this.mapToTransaction(payload)));
    this.loadingService.loadingOff();
  }

  private mapToTransaction(payload: MonthlyIncome[]) {
    const monthlyIncomes: MonthlyTransaction[] = [];
    payload.forEach((x) => {
      const newTransactionItem: MonthlyTransaction = {
        month: x.month,
        month_text: x.month_text,
        total: x.total,
        transactions: [],
        year: x.year,
      };
      const allIncomeTransactions: TransactionExpand[] = [];
      x.transactions.forEach((y) => {
        allIncomeTransactions.push(this.fillTransactionExpand(y));
      });
      newTransactionItem.transactions = allIncomeTransactions;
      monthlyIncomes.push(newTransactionItem);
    });
    return monthlyIncomes;
  }

  private fillTransactionExpand(income: Income): TransactionExpand {
    return {
      id: income.id,
      amount: income.amount,
      category: income.category,
      category_text: income.category_text || '',
      destination: income.destination,
      date: income.date,
      year: income.year,
      month: income.month,
      month_text: income.month_text,
      notes: income.notes || '',
      alias: '',
      delete_reason: '',
      is_deleted: false,
      is_expense: false,
      is_merge: false,
      is_payment: false,
      is_saving: false,
      merge_id: null,
      payment_method: 0,
      payment_method_text: '',
      subcategory: 0,
      subcategory_text: '',
    };
  }
}
