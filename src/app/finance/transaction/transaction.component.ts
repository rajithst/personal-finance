import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { DataService } from '../service/data.service';
import { Observable, of, ReplaySubject, takeUntil } from 'rxjs';
import { MonthlyTransaction, TransactionFilter } from '../model/transactions';
import { Title } from '@angular/platform-browser';
import { EXPENSE, INCOME, PAYMENT, SAVING } from '../data/client.data';
import { ApiService } from '../../core/api.service';
import { AsyncPipe } from '@angular/common';
import { TransactionTableComponent } from './transaction-table/transaction-table.component';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButton } from '@angular/material/button';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrl: './transaction.component.scss',
  imports: [
    MatTabsModule,
    RouterOutlet,
    RouterLink,
    MatButton,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
  ],
})
export class FinanceComponent implements OnInit {
  title = inject(Title);
  dataService = inject(DataService);
  private readonly router = inject(Router);
  tabs = [
    { label: 'All Transactions', route: 'expense' },
    { label: 'Income', route: 'income' },
    { label: 'Payments', route: 'payment' },
    { label: 'Savings', route: 'saving' },
  ];
  activeLink = { label: '', route: '' };
  financeYears: number[] = [2025, 2024, 2023, 2022, 2021, 2020];

  ngOnInit(): void {
    this.title.setTitle('Finance');
    const currentPath = this.router.url.split('/').at(-1);
    this.activeLink =
      this.tabs.find((tab) => tab.route === currentPath) || this.tabs[0];
  }

  onYearSelect(year: number) {
    this.dataService.setFilterYear(year);
  }
}

@Component({
  selector: 'app-transaction-detail',
  template: '',
  styles: '',
  standalone: true,
})
export class TransactionDetailComponent implements OnInit, OnDestroy {
  target: string = EXPENSE;
  data$: Observable<MonthlyTransaction[] | null>;
  protected apiService = inject(ApiService);
  protected readonly destroyed$ = new ReplaySubject<void>(1);
  private readonly dataService = inject(DataService);

  ngOnInit(): void {
    this.dataService.year$
      .pipe(takeUntil(this.destroyed$))
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

  async extracted(filters: TransactionFilter) {
    this.data$ = of(await this.apiService.getTransactions(filters));
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}

@Component({
  selector: 'app-expenses',
  template:
    '<app-transaction-table [transactions]="data$ | async" [transactionType]="target"></app-transaction-table>',
  styles: '',
  imports: [TransactionTableComponent, AsyncPipe],
})
export class ExpensesComponent extends TransactionDetailComponent {
  override target: string = EXPENSE;
}

@Component({
  selector: 'app-payments',
  template:
    '<app-transaction-table [transactions]="data$ | async" [transactionType]="target"></app-transaction-table>',
  styles: '',
  imports: [TransactionTableComponent, AsyncPipe],
})
export class PaymentsComponent extends TransactionDetailComponent {
  override target: string = PAYMENT;
}

@Component({
  selector: 'app-savings',
  template:
    '<app-transaction-table [transactions]="data$ | async" [transactionType]="target"></app-transaction-table>',
  styles: '',
  imports: [TransactionTableComponent, AsyncPipe],
})
export class SavingsComponent extends TransactionDetailComponent {
  override target: string = SAVING;
}

@Component({
  selector: 'app-income',
  template:
    '<app-transaction-table [transactions]="data$ | async" [transactionType]="target"></app-transaction-table>',
  styles: '',
  imports: [TransactionTableComponent, AsyncPipe],
})
export class IncomesComponent extends TransactionDetailComponent {
  override target: string = INCOME;
}
