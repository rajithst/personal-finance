import { Component, OnInit } from '@angular/core';
import { MonthlyTransaction } from '../model/transactions';
import { MatDialog } from '@angular/material/dialog';
import {
  SessionEventMessage,
  SessionService,
} from '../service/session.service';
import { ActivatedRoute, NavigationEnd, Params, Router } from '@angular/router';
import { TransactionUpdateDialog } from '../transaction-update/transaction-update.component';
import {
  faCirclePlus,
  faFilter,
  faPencil,
  faTrash,
  faUpload,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrl: './transaction.component.css',
})
export class FinanceComponent {
  message = this.sessionService.getEventMessage();
  sessionData = this.sessionService.getData();
  protected readonly faCirclePlus = faCirclePlus;
  protected readonly faFilter = faFilter;
  protected readonly faUpload = faUpload;
  protected readonly faPencil = faPencil;
  protected readonly faTrash = faTrash;

  constructor(
    private dialog: MatDialog,
    protected router: Router,
    protected route: ActivatedRoute,
    private sessionService: SessionService,
  ) {}

  pageTitle = 'Transactions Activity'
  transactionData: MonthlyTransaction[] = [];

  dataYear: number[] = [];
  dataMonth: number[] = [];
  paymentMethod: number[] = [];
  transactionCategory: number[] = [];
  transactionSubCategory: number[] = [];
  searchQuery: string = '';

  today = new Date();
  currentMonthNumber = this.today.getMonth() + 1;
  currentYear = this.today.getFullYear();

  protected fetchQueryParams(params: Params) {
    const getOrDefault = (value: string) => {
      return value === '' ? [] : value.split(',').map(Number);
    };

    this.transactionCategory = getOrDefault(params['cat']! || '');
    this.transactionSubCategory = getOrDefault(params['subcat']! || '');
    this.dataYear = getOrDefault(params['years']! || '');
    this.dataMonth = getOrDefault(params['months']! || '');
    this.paymentMethod = getOrDefault(params['pm']! || '');
    if (this.dataYear.length == 0) {
      this.dataYear = [this.currentYear];
    }
    if (this.dataMonth.length == 0) {
      this.dataMonth = Array.from(
        { length: this.currentMonthNumber },
        (_, i) => i + 1,
      );
    }
  }

  addTransaction() {
    this.dialog.open(TransactionUpdateDialog, {
      width: '850px',
      position: {
        top: '50px',
      },
      data: { formData: null, task: 'add' },
    });
  }

  protected filterData() {
    let years: number[] = this.dataYear || [];
    let months: number[] = this.dataMonth || [];
    const paymentMethods: number[] = this.paymentMethod || [];
    const categories: number[] = this.transactionCategory || [];
    const subCategories: number[] = this.transactionSubCategory || [];
    const searchQuery: string = this.searchQuery;

    const currData = this.getDataStream()
      .filter((x) => years.includes(x.year))
      .filter((x) => (months.length > 0 ? months.includes(x.month) : true))
      .sort((x, y) => y.month - x.month)
      .sort((x, y) => y.year - x.year);
    currData.forEach((x) => {
      x.transactions_cp = x.transactions
        .filter((y) =>
          paymentMethods && paymentMethods.length > 0
            ? paymentMethods.includes(y.payment_method)
            : true,
        )
        .filter((y) =>
          categories.length > 0 ? categories.includes(y.category) : true,
        )
        .filter((y) =>
          subCategories.length > 0
            ? subCategories.includes(y.subcategory)
            : true,
        )
        .filter((y) =>
          searchQuery.length > 0
            ? y.destination.includes(searchQuery) ||
              y.alias?.includes(searchQuery)
            : true,
        );
      x.total = x.transactions_cp.reduce(
        (total, { amount }) => total + amount!,
        0,
      );
    });
    this.transactionData = currData;
  }

  getDataStream(): MonthlyTransaction[] {
    return [];
  }

  onTransactionChecked(selectedIds: number[]) {
  }
}

@Component({
  selector: 'app-income',
  //templateUrl: './transaction.component.html',
  template: `<app-transaction-table [transactions]="transactionData"></app-transaction-table>`,
  styleUrl: './transaction.component.css',
})
export class IncomeComponent extends FinanceComponent implements OnInit {
  override pageTitle = 'Income Activity'
  ngOnInit() {
    this.message.subscribe((msg: SessionEventMessage) => {
      if (
        msg === SessionEventMessage.INIT_SESSION_LOAD_SUCCESS ||
        msg == SessionEventMessage.SESSION_TRANSACTION_UPDATE_SUCCESS
      ) {
        this.fetchQueryParams(this.route.snapshot.queryParams);
        this.filterData();
      }
    });
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.fetchQueryParams(this.route.snapshot.queryParams);
        this.filterData();
      }
    });
  }
  override getDataStream(): MonthlyTransaction[] {
    return this.sessionData.incomes;
  }
}

@Component({
  selector: 'app-expense',
  //templateUrl: './transaction.component.html',
  template: `<app-transaction-table [transactions]="transactionData"></app-transaction-table>`,
  styleUrl: './transaction.component.css',
})
export class ExpenseComponent extends FinanceComponent implements OnInit {
  override pageTitle = 'Transaction Activity'
  ngOnInit() {
    this.message.subscribe((msg: SessionEventMessage) => {
      if (
        msg === SessionEventMessage.INIT_SESSION_LOAD_SUCCESS ||
        msg == SessionEventMessage.SESSION_TRANSACTION_UPDATE_SUCCESS
      ) {
        this.fetchQueryParams(this.route.snapshot.queryParams);
        this.filterData();
      }
    });
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.fetchQueryParams(this.route.snapshot.queryParams);
        this.filterData();
      }
    });
  }

  override getDataStream(): MonthlyTransaction[] {
    return this.sessionData.expenses;
  }
}

@Component({
  selector: 'app-payment',
  //templateUrl: './transaction.component.html',
  template: `<app-transaction-table [transactions]="transactionData"></app-transaction-table>`,
  styleUrl: './transaction.component.css',
})
export class PaymentComponent extends FinanceComponent implements OnInit {
  override pageTitle = 'Payment Activity'
  ngOnInit() {
    this.message.subscribe((msg: SessionEventMessage) => {
      if (
        msg === SessionEventMessage.INIT_SESSION_LOAD_SUCCESS ||
        msg == SessionEventMessage.SESSION_TRANSACTION_UPDATE_SUCCESS
      ) {
        this.fetchQueryParams(this.route.snapshot.queryParams);
        this.filterData();
      }
    });
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.fetchQueryParams(this.route.snapshot.queryParams);
        this.filterData();
      }
    });
  }
  override getDataStream(): MonthlyTransaction[] {
    return this.sessionData.payments;
  }
}

@Component({
  selector: 'app-saving',
  //templateUrl: './transaction.component.html',
  template: `<app-transaction-table [transactions]="transactionData"></app-transaction-table>`,
  styleUrl: './transaction.component.css',
})
export class SavingComponent extends FinanceComponent implements OnInit {
  override pageTitle = 'Savings Activity'
  ngOnInit() {
    this.message.subscribe((msg: SessionEventMessage) => {
      if (
        msg === SessionEventMessage.INIT_SESSION_LOAD_SUCCESS ||
        msg == SessionEventMessage.SESSION_TRANSACTION_UPDATE_SUCCESS
      ) {
        this.fetchQueryParams(this.route.snapshot.queryParams);
        this.filterData();
      }
    });
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.fetchQueryParams(this.route.snapshot.queryParams);
        this.filterData();
      }
    });
  }
  override getDataStream(): MonthlyTransaction[] {
    return this.sessionData.saving;
  }
}
