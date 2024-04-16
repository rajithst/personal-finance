import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { ReplaySubject, Subject } from 'rxjs';
import { Income, MonthlyIncome, IncomeRequest } from '../shared/interface/income.data';
import {
  MonthlyTransaction,
  Transaction,
  TransactionRequest,
  TransactionsResponse
} from '../shared/interface/transactions';

export class SessionData {
  incomes: MonthlyIncome[] =  [];
  saving: MonthlyTransaction[] = [];
  expenses: MonthlyTransaction[] = [];
  payments:  MonthlyTransaction[] = [];
}

export enum SessionEventMessage {
  INIT_SESSION_LOAD_SUCCESS,
  INIT_SESSION_LOAD_FAILED,
  SESSION_TRANSACTION_UPDATE_SUCCESS,
  SESSION_TRANSACTION_UPDATE_FAILED
}

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  session: SessionData  = new SessionData()
  message: Subject<SessionEventMessage> = new ReplaySubject<SessionEventMessage>(1)
  constructor(private apiService: ApiService) {}

  getEventMessage() {
    return this.message;
  }

  getData() {
    return this.session;
  }

  refresh() {

    const getTransactionList = (x: MonthlyTransaction[]) => {
      let results: Transaction[] = [];
      x.forEach(y => results =  results.concat(y.transactions))
      return results;
    };

    this.apiService.getTransactions().subscribe((transactions: TransactionsResponse) => {
      this.session.incomes = transactions.income;
      this.session.saving = transactions.saving;
      this.session.expenses = transactions.expense;
      this.session.payments = transactions.payment;
      this.message.next(SessionEventMessage.INIT_SESSION_LOAD_SUCCESS)
    })

  }

  updateIncome(payload:IncomeRequest) {
    this.apiService.updateIncome(payload).subscribe((income: Income) => {
      if (income) {
        this.updateSessionIncome(income);
        this.message.next(SessionEventMessage.SESSION_TRANSACTION_UPDATE_SUCCESS)
      } else {
        this.message.next(SessionEventMessage.SESSION_TRANSACTION_UPDATE_FAILED)
      }
    })
  }

  updateTransaction(payload:TransactionRequest) {
    this.apiService.updateTransaction(payload).subscribe((transaction: Transaction) => {
      if (transaction) {
        this.syncSessionTransaction(transaction);
        this.message.next(SessionEventMessage.SESSION_TRANSACTION_UPDATE_SUCCESS)
      } else {
        this.message.next(SessionEventMessage.SESSION_TRANSACTION_UPDATE_FAILED)
      }
    })
  }


  updateSessionIncome(data: Income) {
    const idx = this.session.incomes.findIndex((x: MonthlyIncome) => x.year == data.year && x.month == data.month)
    if (idx !== -1) {
      const currItem = this.session.incomes[idx];
      const incomeId = currItem.transactions.findIndex((x: Income) => x.id == data.id);
      this.session.incomes[idx]['total'] += data.amount
      if (incomeId !== -1) {
        const currTransaction = currItem.transactions[incomeId];
        this.session.incomes[idx].transactions[incomeId] = data
        this.session.incomes[idx]['total'] -= currTransaction.amount;
      } else {
        this.session.incomes[idx].transactions.push(data)
      }
    } else  {
      const incomeObject: MonthlyIncome = {year: data.year!, month: data.month!, month_text: data.month_text!, 'total': data.amount, 'transactions': []}
      incomeObject.transactions.push(data)
      this.session.incomes.push(incomeObject)
    }
  }

  syncSessionTransaction(data: Transaction) {
    let source = this.getTargetMonthlyTransaction(data);
    const idx = source.findIndex((x: MonthlyTransaction) => x.year == data.year && x.month == data.month)
    if (idx !== -1) {
      const currItem = source[idx];
      const expId = currItem.transactions.findIndex((x: Transaction) => x.id == data.id);
      if (expId !== -1) {
        const currTransaction = currItem.transactions[expId];
        if (data.is_deleted)  {
          source[idx].transactions.splice(expId, 1)
        } else {
          source[idx].transactions[expId] = data
        }
      } else {
        source[idx].transactions.push(data);
      }
    } else  {
      const transactionObject: MonthlyTransaction = {year: data.year!, month: data.month!, month_text: data.month_text!, total: data.amount, transactions: [], transactions_cp: []}
      transactionObject.transactions.push(data)
      source.push(transactionObject)
    }
    this.updateSession(data, source);
  }

  updateSession(payload: Transaction, update: MonthlyTransaction[]) {
    if (payload.is_expense) {
      this.session.expenses = update;
    } else if (payload.is_saving) {
      this.session.saving = update;
    }
  }

  getTargetMonthlyTransaction(payload: Transaction): MonthlyTransaction[] {
    if (payload.is_expense) {
      return this.session.expenses;
    } else if (payload.is_saving) {
      return this.session.saving;
    } else {
      return this.session.expenses
    }
  }
}
