import { Injectable } from '@angular/core';
import { ApiService } from '../../core/api.service';
import {
  Income,
  IncomeRequest,
} from '../model/income.data';
import {
  MonthlyTransaction,
  Transaction, TransactionExpand,
  TransactionsResponse,
} from '../model/transactions';

export class SessionData {
  incomes: MonthlyTransaction[] = [];
  saving: MonthlyTransaction[] = [];
  expenses: MonthlyTransaction[] = [];
  payments: MonthlyTransaction[] = [];
  destinations: string[] = [];
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
      source = this.session.saving
    }
    let idx = source.findIndex(
      (x: MonthlyTransaction) => x.year == newData.year && x.month == newData.month,
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
      source[idx].transactions_cp = JSON.parse(JSON.stringify(source[idx].transactions));
      source[idx].total = source[idx].transactions_cp.reduce((acc, tr) => acc + tr.amount!, 0);
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



}
