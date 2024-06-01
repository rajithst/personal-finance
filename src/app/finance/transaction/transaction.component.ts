import { Component, OnInit } from '@angular/core';
import { MonthlyTransaction } from '../model/transactions';
import { MatDialog } from '@angular/material/dialog';
import {
  SessionEventMessage,
  SessionService,
} from '../service/session.service';
import {ActivatedRoute, NavigationEnd, Params, Router} from '@angular/router';
import { TransactionUpdateDialog } from '../transaction-update/transaction-update.component';
import {
  faBank,
  faCirclePlus,
  faFilter,
  faLayerGroup,
  faList,
  faPlus,
  faSearch, faShop, faTag,
  faUpload
} from "@fortawesome/free-solid-svg-icons";


@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrl: './transaction.component.css',
})
export class TransactionComponent {
  message = this.sessionService.getEventMessage();
  sessionData = this.sessionService.getData();
  constructor(
    private dialog: MatDialog,
    protected router: Router,
    protected route: ActivatedRoute,
    private sessionService: SessionService,
  ) {}

  transactionData: MonthlyTransaction[] = [];

  dataYear: number[] = [];
  dataMonth: number[] = [];
  paymentMethod: number[] = [];
  transactionCategory: number[] = [];
  transactionSubCategory: number[] = [];
  searchQuery: string = '';

  protected fetchQueryParams(params: Params) {
    const getOrDefault = (value: string) =>  { return value === '' ? [] : value.split(',').map(Number) }

    this.transactionCategory = getOrDefault(params['cat']! || '');
    this.transactionSubCategory = getOrDefault(params['subcat']! || '');
    this.dataYear = getOrDefault(params['years']! || '');
    this.dataMonth = getOrDefault(params['months']! || '');
    this.paymentMethod = getOrDefault(params['pm']! || '');
    if (this.dataYear.length == 0) {
      this.dataYear = [2024];
    }
    if (this.dataMonth.length == 0) {
      this.dataMonth = [1, 2, 3, 4];
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
    return []
  }

  onTransactionChecked(selectedIds: number[]) {
    console.log(selectedIds);
  }

    protected readonly faCirclePlus = faCirclePlus;
  protected readonly faFilter = faFilter;
  protected readonly faSearch = faSearch;
  protected readonly faList = faList;
  protected readonly faUpload = faUpload;
  protected readonly faPlus = faPlus;
  protected readonly faLayerGroup = faLayerGroup;
  protected readonly faShop = faShop;
  protected readonly faBank = faBank;
  protected readonly faTag = faTag;
}

@Component({
  selector: 'app-income',
  templateUrl: './transaction.component.html',
  styleUrl: './transaction.component.css',
})
export class IncomeComponent extends TransactionComponent implements OnInit {

  ngOnInit() {
    this.message.subscribe((msg: SessionEventMessage) => {
      if (
        msg === SessionEventMessage.INIT_SESSION_LOAD_SUCCESS ||
        msg == SessionEventMessage.SESSION_TRANSACTION_UPDATE_SUCCESS
      ) {
        this.fetchQueryParams(this.route.snapshot.queryParams)
        this.filterData();
      }
    });
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.fetchQueryParams(this.route.snapshot.queryParams)
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
  templateUrl: './transaction.component.html',
  styleUrl: './transaction.component.css',
})
export class ExpenseComponent extends TransactionComponent implements OnInit {
  ngOnInit() {
    this.message.subscribe((msg: SessionEventMessage) => {
      if (
        msg === SessionEventMessage.INIT_SESSION_LOAD_SUCCESS ||
        msg == SessionEventMessage.SESSION_TRANSACTION_UPDATE_SUCCESS
      ) {
        this.fetchQueryParams(this.route.snapshot.queryParams)
        this.filterData();
      }
    });
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        console.log('subscribing to params on expense')
        this.fetchQueryParams(this.route.snapshot.queryParams)
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
  templateUrl: './transaction.component.html',
  styleUrl: './transaction.component.css',
})
export class PaymentComponent extends TransactionComponent implements OnInit {

  ngOnInit() {
    this.message.subscribe((msg: SessionEventMessage) => {
      if (
        msg === SessionEventMessage.INIT_SESSION_LOAD_SUCCESS ||
        msg == SessionEventMessage.SESSION_TRANSACTION_UPDATE_SUCCESS
      ) {
        this.fetchQueryParams(this.route.snapshot.queryParams)
        this.filterData();
      }
    });
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.fetchQueryParams(this.route.snapshot.queryParams)
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
  templateUrl: './transaction.component.html',
  styleUrl: './transaction.component.css',
})
export class SavingComponent extends TransactionComponent implements OnInit {

  ngOnInit(){
    this.message.subscribe((msg: SessionEventMessage) => {
      if (
        msg === SessionEventMessage.INIT_SESSION_LOAD_SUCCESS ||
        msg == SessionEventMessage.SESSION_TRANSACTION_UPDATE_SUCCESS
      ) {
        this.fetchQueryParams(this.route.snapshot.queryParams)
        this.filterData();
      }
    });
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.fetchQueryParams(this.route.snapshot.queryParams)
        this.filterData();
      }
    });
  }
  override getDataStream(): MonthlyTransaction[] {
    return this.sessionData.saving;
  }
}
