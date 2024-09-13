import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { LoadingService } from '../../shared/loading/loading.service';
import {
  faSquareCaretLeft,
  faSquareCaretRight,
} from '@fortawesome/free-solid-svg-icons';
import { DataService } from '../service/data.service';
import {map, Observable, ReplaySubject, take, takeUntil} from 'rxjs';
import { MonthlyTransaction, TransactionFilter } from '../model/transactions';
import { Title } from '@angular/platform-browser';
import { EXPENSE, INCOME, PAYMENT, SAVING } from '../../data/shared.data';
import { ApiService } from '../../core/api.service';

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

  today = new Date();
  currentYear = this.today.getFullYear();

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
    this.dataService.yearSwitch$
      .pipe(takeUntil(this.destroyed$), take(1))
      .subscribe((value) => {
        this.extracted({ target: this.target, year: value });
      });

    this.dataService.refresh$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((value) => {
        if (value) {
          this.extracted({
            target: this.target,
            year: this.dataService.getFilterYear(),
          });
        }
      });
  }

  extracted(filters: TransactionFilter) {
    console.log('calling extracted')
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
    '<app-transaction-table [transactions]="(data$ | async) ?? []" [transactionType]="target"></app-transaction-table>',
  styles: '',
})
export class ExpensesComponent extends TransactionDetailComponent {
  override target: string = EXPENSE;
}

@Component({
  selector: 'app-payments',
  template:
    '<app-transaction-table [transactions]="(data$ | async) ?? []" [transactionType]="target"></app-transaction-table>',
  styles: '',
})
export class PaymentsComponent extends TransactionDetailComponent {
  override target: string = PAYMENT;
}

@Component({
  selector: 'app-savings',
  template:
    '<app-transaction-table [transactions]="(data$ | async) ?? []" [transactionType]="target"></app-transaction-table>',
  styles: '',
})
export class SavingsComponent extends TransactionDetailComponent {
  override target: string = SAVING;
}

@Component({
  selector: 'app-income',
  template:
    '<app-transaction-table [transactions]="(data$ | async) ?? []" [transactionType]="target"></app-transaction-table>',
  styles: '',
})
export class IncomesComponent extends TransactionDetailComponent {
  override target: string = INCOME;
}
