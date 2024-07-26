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
  faSquareCaretLeft,
  faSquareCaretRight,
} from '@fortawesome/free-solid-svg-icons';
import { DataService } from '../service/data.service';
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
export class FinanceComponent {
  protected readonly faSquareCaretRight = faSquareCaretRight;
  protected readonly faSquareCaretLeft = faSquareCaretLeft;
  protected readonly INCOME = INCOME;
  protected readonly PAYMENT = PAYMENT;
  protected readonly SAVING = SAVING;
  protected readonly EXPENSE = EXPENSE;

  protected loadingService = inject(LoadingService);
  private dataService = inject(DataService);

  title = inject(Title);

  searchInput = viewChild<ElementRef>('searchInput');

  today = new Date();
  currentYear = this.today.getFullYear();

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
      source: 1,
    };
  }
}
