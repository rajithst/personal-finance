import { Injectable } from '@angular/core';
import {
  MonthlyTransaction,
  Transaction,
  TransactionExpand,
  TransactionFilter,
  TransactionFilterTemplate,
  TransactionsResponse,
} from '../model/transactions';
import { DestinationMap } from '../model/payee';

export class SessionData {
  incomes: MonthlyTransaction[] = [];
  saving: MonthlyTransaction[] = [];
  expenses: MonthlyTransaction[] = [];
  payments: MonthlyTransaction[] = [];
  destinations: string[] = [];
  payees: DestinationMap[] = [];
  filterYear: number = new Date().getFullYear();
  searchQuery: string = '';
  filters: TransactionFilterTemplate[] = [
    {
      target: 'transaction',
      conditions: this.getEmptyFilterTemplate(),
    },
    {
      target: 'payments',
      conditions: this.getEmptyFilterTemplate(),
    },
    {
      target: 'savings',
      conditions: this.getEmptyFilterTemplate(),
    },
    {
      target: 'income',
      conditions: this.getEmptyFilterTemplate(),
    },
  ];

  getEmptyFilterTemplate(): TransactionFilter {
    return {
      categories: [],
      subcategories: [],
      paymentMethods: [],
    };
  }
}

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private session: SessionData = new SessionData();

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

  setSearchQuery(filterValue: string) {
    this.session.searchQuery = filterValue;
  }

  setPayeeSessionData(payeeData: DestinationMap[]) {
    this.session.payees = payeeData;
  }

  setSessionFilterYear(year: number) {
    this.session.filterYear = year;
  }

  clearSessionFilter(filter: string) {
    const idx = this.session.filters.findIndex((x) => x.target === filter);
    if (idx !== -1) {
      this.session.filters[idx] = {
        target: filter,
        conditions: this.session.getEmptyFilterTemplate(),
      };
    }
  }

  syncSessionTransaction(newData: TransactionExpand, target: string) {
    let [source, idx, expId] = this.getTargetTransactionIds(newData, target);
    if (idx !== -1) {
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
      idx = Date.now();
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

  deleteMergedTransactions(transactions: TransactionExpand[], target: string) {
    transactions.forEach((transaction: TransactionExpand) => {
      let [source, idx, expId] = this.getTargetTransactionIds(transaction, target)
      if (idx !== -1) {
        if (expId !== -1) {
          source[idx].transactions.splice(expId, 1);
        }
      }
    })

  }

  private getTargetTransactionIds(transaction: TransactionExpand, target: string): [MonthlyTransaction[], number, number] {
    let source: MonthlyTransaction[] = this.session.expenses;
    if (target === 'payments') {
      source = this.session.payments;
    } else if (target === 'savings') {
      source = this.session.saving;
    }
    let childId = -1;
    let parentId = source.findIndex(
      (x: MonthlyTransaction) =>
        x.year == transaction.year && x.month == transaction.month,
    );
    if (parentId !== -1) {
      const currItem = source[parentId];
      childId = currItem.transactions.findIndex(
        (x: Transaction) => x.id == transaction.id,
      );
    }
    return [source, parentId, childId];
  }

  filterTransactions(target: string): MonthlyTransaction[] {
    let source = this.session.expenses;
    let filterSet = this.session.filters.find((x) => x.target === target);
    if (target === 'income') {
      source = this.session.incomes;
    } else if (target === 'payments') {
      source = this.session.payments;
    } else if (target === 'savings') {
      source = this.session.saving;
    }

    const paymentMethods: number[] = filterSet!.conditions.paymentMethods;
    const categories: number[] = filterSet!.conditions.categories;
    const subCategories: number[] = filterSet!.conditions.subcategories;
    const searchQuery: string = this.session.searchQuery.toLowerCase();

    const currData = source
      .filter(x => x.year == this.session.filterYear)
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
            ? y.destination.toLowerCase().includes(searchQuery) ||
              y.alias?.toLowerCase().includes(searchQuery) ||
            y.notes?.toLowerCase().includes(searchQuery) ||
            y.amount?.toString().toLowerCase().includes(searchQuery) ||
            y.category_text?.toLowerCase().includes(searchQuery) ||
            y.subcategory_text?.toLowerCase().includes(searchQuery) ||
            y.payment_method_text?.toLowerCase().includes(searchQuery) ||
            y.date?.toLowerCase().includes(searchQuery)
            : true,
        );
      x.total = x.transactions_cp.reduce(
        (total, { amount }) => total + amount!,
        0,
      );
      x.transactions_cp = x.transactions_cp.sort((a, b) => {
        const d1 = new Date(a.date);
        const d2 = new Date(b.date);
        if (d1 < d2) {
          return -1;
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
