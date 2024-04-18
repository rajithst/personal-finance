import { Component, OnInit } from '@angular/core';
import {
  MonthlyTransaction,
  Transaction,
} from '../../shared/interface/transactions';
import { MatDialog } from '@angular/material/dialog';
import {
  SessionEventMessage,
  SessionService,
} from '../../core/session.service';
import { NavigationEnd, Router } from '@angular/router';
import {
  INCOME_CATEGORIES,
  MONTHS, PAYMENT_CATEGORY_ID,
  PAYMENT_METHODS, SAVINGS_CATEGORY_ID,
  TRANSACTION_CATEGORIES,
  TRANSACTION_SUB_CATEGORIES,
  YEARS,
} from '../../shared/static/client_data';
import { TransactionUpdateDialog } from '../transaction-update/transaction-update.component';
import { DropDownType } from '../../shared/interface/common.data';
import {BarChartOptions} from "../charts/options/chart_options";

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrl: './transaction.component.css',
})
export class TransactionComponent implements OnInit {
  private message = this.sessionService.getEventMessage();
  private sessionData = this.sessionService.getData();

  protected readonly YEARS = YEARS;
  protected readonly MONTHS = MONTHS;
  protected readonly PAYMENT_METHODS = PAYMENT_METHODS;
  protected readonly TRANSACTION_CATEGORIES = TRANSACTION_CATEGORIES;
  protected readonly TRANSACTION_SUB_CATEGORIES: DropDownType[] = [];
  constructor(
    private dialog: MatDialog,
    private router: Router,
    private sessionService: SessionService,
  ) {}
  displayedColumns: string[] = [
    'date',
    'category',
    'subcategory',
    'payment_method',
    'amount',
    'destination',
    'actions',
  ];
  transactionData: MonthlyTransaction[] = [];
  dataStream: MonthlyTransaction[] = [];
  filterCategories: DropDownType[] = [];
  targetCategory: number = 1;
  barChartData: any[] = [];
  pieChartData: any[] = [];

  dataYear: number[] = [2024];
  dataMonth: number[] = [1, 2, 3];
  paymentMethod: number[] = [];
  transactionCategory: number[] = [];
  transactionSubCategory: number[] = [];
  searchQuery: string = '';
  barChartOptionsMonthly: BarChartOptions = {type: 'vertical', xAxisLabel: 'Months', yAxisLabel: 'Amount'};
  barChartOptionsCategory: BarChartOptions = {type: 'horizontal', xAxisLabel: 'Amount', yAxisLabel: 'Category'};


  ngOnInit() {
    this.message.subscribe((msg: SessionEventMessage) => {
      if (
        msg === SessionEventMessage.INIT_SESSION_LOAD_SUCCESS ||
        msg == SessionEventMessage.SESSION_TRANSACTION_UPDATE_SUCCESS
      ) {
        this.initPageParams()
        this.filterData();
      }
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
  }
  protected filterData() {
    const years: number[] = this.dataYear || [];
    const months: number[] = this.dataMonth || [];
    const paymentMethods: number[] = this.paymentMethod || [];
    const categories: number[] = this.transactionCategory || [];
    const subCategories: number[] = this.transactionSubCategory || [];
    const searchQuery: string = this.searchQuery;

    const currData = this.dataStream
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
        (total, { amount }) => total + amount,
        0,
      );
    });
    this.transactionData = currData;
    this.barChartData = this.transactionData.map(x => ({'name': x.month_text, 'value': x.total}))
    this.pieChartData = this.getSumByCategory(currData)
  }

  private getSumByCategory(transactions: MonthlyTransaction[]) {
    const categorySums: { [category: string]: number } = {};

    this.filterCategories.forEach(category => {
      categorySums[category.viewValue] = 0;
    });

    transactions.forEach(data => {
      data.transactions_cp.forEach(x => {
        const category = this.targetCategory == 1 ? x.category_text! : x.subcategory_text!;
        const amount = x.amount;
        if (categorySums.hasOwnProperty(category)) {
          categorySums[category] += amount
        }
      })
    })
    const sumByCatehory: any[] = [];
    for (const [key, value] of Object.entries(categorySums)) {
      sumByCatehory.push({'name': key, 'value': value})
    }
    return sumByCatehory;
  }

  onSelectionChange($event: any) {
    console.log($event)
  }

  private initPageParams() {
    const currentURL = this.router.url;
    if (currentURL === '/expense') {
      this.dataStream = this.sessionData.expenses;
      this.filterCategories = TRANSACTION_CATEGORIES
      this.targetCategory = 1;
    } else if (currentURL === '/savings') {
      this.dataStream = this.sessionData.saving;
      this.filterCategories = TRANSACTION_SUB_CATEGORIES[SAVINGS_CATEGORY_ID]
      this.targetCategory = 2;
    } else if (currentURL === '/payments') {
      this.dataStream = this.sessionData.payments;
      this.filterCategories = TRANSACTION_SUB_CATEGORIES[PAYMENT_CATEGORY_ID]
      this.targetCategory = 2;
    } else if (currentURL == '/income') {
      this.dataStream = this.sessionData.incomes;
      this.filterCategories = INCOME_CATEGORIES
      this.targetCategory = 1;
    } else {
      this.dataStream = [];
    }
  }
}
