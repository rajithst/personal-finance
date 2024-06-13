import { Injectable } from '@angular/core';
import { ApiService } from '../../core/api.service';
import { Income, IncomeRequest } from '../model/income.data';
import {
  MonthlyTransaction,
  Transaction,
  TransactionExpand, TransactionFilterDialogData,
  TransactionsResponse,
} from '../model/transactions';

export class SessionData {
  incomes: MonthlyTransaction[] = [];
  saving: MonthlyTransaction[] = [];
  expenses: MonthlyTransaction[] = [];
  payments: MonthlyTransaction[] = [];
  destinations: string[] = [];
  filters: TransactionFilterDialogData = {
    categories: [],
    subcategories: [],
    months: [],
    years: [2024],
    paymentMethods: [],
  };
  panelSettings: any = []
}

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private session: SessionData = new SessionData();
  constructor(private apiService: ApiService) {}

  getData() {
    return this.session;
  }

  setSessionData(resolvedData: TransactionsResponse) {
    this.session.incomes = resolvedData.income;
    this.session.saving = resolvedData.saving;
    this.session.expenses = resolvedData.expense;
    this.session.payments = resolvedData.payment;
    this.session.destinations = resolvedData.destinations;
  }

  updateIncome(payload: IncomeRequest) {
    this.apiService.updateIncome(payload).subscribe((income: Income) => {
      if (income) {
        //this.updateSessionIncome(income);
      } else {
      }
    });
  }

  syncSessionTransaction(newData: TransactionExpand, target: string) {
    let source: MonthlyTransaction[] = this.session.expenses;
    if (target === 'payments') {
      source = this.session.payments;
    } else if (target === 'savings') {
      source = this.session.saving;
    }
    let idx = source.findIndex(
      (x: MonthlyTransaction) =>
        x.year == newData.year && x.month == newData.month,
    );
    if (idx !== -1) {
      const currItem = source[idx];
      const expId = currItem.transactions.findIndex(
        (x: Transaction) => x.id == newData.id,
      );
      if (expId !== -1) {
        if (newData.is_deleted) {
          source[idx].transactions.splice(expId, 1);
        } else {
          source[idx].transactions[expId] = newData;
        }
      } else {
        source[idx].transactions.push(newData);
      }
      source[idx].transactions_cp = JSON.parse(
        JSON.stringify(source[idx].transactions),
      );
      source[idx].total = source[idx].transactions_cp.reduce(
        (acc, tr) => acc + tr.amount!,
        0,
      );
    } else {
      idx = 0;
      const transactionObject: MonthlyTransaction = {
        year: newData.year!,
        month: newData.month!,
        month_text: newData.month_text!,
        total: newData.amount!,
        transactions: [],
        transactions_cp: [],
      };
      transactionObject.transactions.push(newData);
      transactionObject.transactions_cp.push(newData);
      source.push(transactionObject);
    }
    return source[idx];
  }

  filterTransactions(): MonthlyTransaction[] {

    let years: number[] = this.session.filters.years;
    let months: number[] = this.session.filters.months;
    const paymentMethods: number[] = this.session.filters.paymentMethods;
    const categories: number[] = this.session.filters.categories;
    const subCategories: number[] = this.session.filters.subcategories;
    const searchQuery: string = '';

    const currData = this.session.expenses
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
        (total, {amount}) => total + amount!,
        0,
      );
      x.transactions_cp = x.transactions_cp.sort((a, b) => {
        const d1 = new Date(a.date)
        const d2 = new Date(b.date)
        if (d1 < d2) {
          return -1
        } else if (d1 === d2) {
          return 0;
        } else {
          return 1;
        }
      });
    });
    return currData;
  }
}
