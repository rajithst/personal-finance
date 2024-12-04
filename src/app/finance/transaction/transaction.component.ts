import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { LoadingService } from '../../shared/loading/loading.service';
import { DataService } from '../../service/data.service';
import { map, Observable, ReplaySubject, takeUntil } from 'rxjs';
import { MonthlyTransaction, TransactionFilter } from '../model/transactions';
import { Title } from '@angular/platform-browser';
import {
  EXPENSE,
  INCOME,
  PAYMENT,
  SAVING,
} from '../../shared/data/shared.data';
import { ApiService } from '../../core/api.service';
import { AsyncPipe } from '@angular/common';
import { TransactionTableComponent } from './transaction-table/transaction-table.component';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { MatRipple } from '@angular/material/core';
import { MatGridList, MatGridTile } from '@angular/material/grid-list';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { MatTabsModule } from '@angular/material/tabs';
import {MatButton} from "@angular/material/button";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrl: './transaction.component.scss',
  standalone: true,
  imports: [
    LoadingComponent,
    MatGridList,
    MatGridTile,
    MatTabsModule,
    MatRipple,
    FaIconComponent,
    RouterOutlet,
    RouterLink,
    MatButton,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
  ],
})
export class FinanceComponent {
  title = inject(Title);
  dataService = inject(DataService);
  tabs = [
    { label: 'All Transactions', route: 'expense' },
    { label: 'Income', route: 'income' },
    { label: 'Payments', route: 'payment' },
    { label: 'Savings', route: 'saving' },
  ];
  activeLink = this.tabs[0];
  financeYears: number[] = [2020, 2021, 2022, 2023, 2024, 2025]

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
  protected loadingService = inject(LoadingService);
  protected readonly destroyed$ = new ReplaySubject<void>(1);
  private readonly dataService = inject(DataService);

  ngOnInit(): void {
    this.dataService.year$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((value) => {
        console.log('from year');
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
    '<app-transaction-table [transactions]="(data$ | async) ?? null" [transactionType]="target"></app-transaction-table>',
  styles: '',
  standalone: true,
  imports: [TransactionTableComponent, AsyncPipe],
})
export class ExpensesComponent extends TransactionDetailComponent {
  override target: string = EXPENSE;
}

@Component({
  selector: 'app-payments',
  template:
    '<app-transaction-table [transactions]="(data$ | async) ?? []" [transactionType]="target"></app-transaction-table>',
  styles: '',
  standalone: true,
  imports: [TransactionTableComponent, AsyncPipe],
})
export class PaymentsComponent extends TransactionDetailComponent {
  override target: string = PAYMENT;
}

@Component({
  selector: 'app-savings',
  template:
    '<app-transaction-table [transactions]="(data$ | async) ?? []" [transactionType]="target"></app-transaction-table>',
  styles: '',
  standalone: true,
  imports: [TransactionTableComponent, AsyncPipe],
})
export class SavingsComponent extends TransactionDetailComponent {
  override target: string = SAVING;
}

@Component({
  selector: 'app-income',
  template:
    '<app-transaction-table [transactions]="(data$ | async) ?? []" [transactionType]="target"></app-transaction-table>',
  styles: '',
  standalone: true,
  imports: [TransactionTableComponent, AsyncPipe],
})
export class IncomesComponent extends TransactionDetailComponent {
  override target: string = INCOME;
}
