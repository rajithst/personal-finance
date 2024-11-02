import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { LoadingService } from '../../shared/loading/loading.service';
import {
  faSquareCaretLeft,
  faSquareCaretRight,
} from '@fortawesome/free-solid-svg-icons';
import { DataService } from '../../service/data.service';
import { map, Observable, ReplaySubject, takeUntil } from 'rxjs';
import {
  MonthlyTransaction,
  TransactionFilter,
} from '../model/transactions';
import { Title } from '@angular/platform-browser';
import { EXPENSE, INCOME, PAYMENT, SAVING } from '../../shared/data/shared.data';
import { ApiService } from '../../core/api.service';
import { MenuItem } from '../model/common';
import { AsyncPipe } from '@angular/common';
import { TransactionTableComponent } from './transaction-table/transaction-table.component';
import { RouterOutlet } from '@angular/router';
import { SearchbarComponent } from '../../shared/searchbar/searchbar.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { MatRipple } from '@angular/material/core';
import { MatGridList, MatGridTile } from '@angular/material/grid-list';
import { ToolbarMenuComponent } from '../../shared/toolbar-menu/toolbar-menu.component';
import { LoadingComponent } from '../../shared/loading/loading.component';

@Component({
    selector: 'app-transaction',
    templateUrl: './transaction.component.html',
    styleUrl: './transaction.component.css',
    standalone: true,
    imports: [
        LoadingComponent,
        ToolbarMenuComponent,
        MatGridList,
        MatGridTile,
        MatRipple,
        FaIconComponent,
        SearchbarComponent,
        RouterOutlet,
    ],
})
export class FinanceComponent {
  title = inject(Title);
  today = new Date();
  currentYear = this.today.getFullYear();
  menuItems: MenuItem[] = [
    { label: 'Transaction', link: EXPENSE },
    { label: 'Income', link: INCOME },
    { label: 'Payment', link: PAYMENT },
    { label: 'Saving', link: SAVING },
  ];
  protected readonly faSquareCaretRight = faSquareCaretRight;
  protected readonly faSquareCaretLeft = faSquareCaretLeft;
  protected loadingService = inject(LoadingService);
  private readonly dataService = inject(DataService);

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
    standalone: true,
})
export class TransactionDetailComponent implements OnInit, OnDestroy {
  target: string = EXPENSE;
  data$: Observable<MonthlyTransaction[]>;
  protected apiService = inject(ApiService);
  protected loadingService = inject(LoadingService);
  protected readonly destroyed$ = new ReplaySubject<void>(1);
  private readonly dataService = inject(DataService);

  ngOnInit(): void {
    this.dataService.yearSwitch$
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
    template: '<app-transaction-table [transactions]="(data$ | async) ?? []" [transactionType]="target"></app-transaction-table>',
    styles: '',
    standalone: true,
    imports: [TransactionTableComponent, AsyncPipe],
})
export class ExpensesComponent extends TransactionDetailComponent {
  override target: string = EXPENSE;
}

@Component({
    selector: 'app-payments',
    template: '<app-transaction-table [transactions]="(data$ | async) ?? []" [transactionType]="target"></app-transaction-table>',
    styles: '',
    standalone: true,
    imports: [TransactionTableComponent, AsyncPipe],
})
export class PaymentsComponent extends TransactionDetailComponent {
  override target: string = PAYMENT;
}

@Component({
    selector: 'app-savings',
    template: '<app-transaction-table [transactions]="(data$ | async) ?? []" [transactionType]="target"></app-transaction-table>',
    styles: '',
    standalone: true,
    imports: [TransactionTableComponent, AsyncPipe],
})
export class SavingsComponent extends TransactionDetailComponent {
  override target: string = SAVING;
}

@Component({
    selector: 'app-income',
    template: '<app-transaction-table [transactions]="(data$ | async) ?? []" [transactionType]="target"></app-transaction-table>',
    styles: '',
    standalone: true,
    imports: [TransactionTableComponent, AsyncPipe],
})
export class IncomesComponent extends TransactionDetailComponent {
  override target: string = INCOME;
}
