import { Injectable } from '@angular/core';
import { ApiService } from '../../core/api.service';
import { ReplaySubject, Subject } from 'rxjs';
import {
  Income,
  IncomeRequest,
} from '../model/income.data';
import {
  MonthlyTransaction,
  Transaction, TransactionExpand, TransactionRequest,
  TransactionsResponse,
} from '../model/transactions';

export class SessionData {
  incomes: MonthlyTransaction[] = [];
  saving: MonthlyTransaction[] = [];
  expenses: MonthlyTransaction[] = [];
  payments: MonthlyTransaction[] = [];
  destinations: string[] = [];
}

export enum SessionEventMessage {
  INIT_SESSION_LOAD_SUCCESS,
  INIT_SESSION_LOAD_FAILED,
  SESSION_TRANSACTION_UPDATE_SUCCESS,
  SESSION_TRANSACTION_UPDATE_FAILED,
}

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private session: SessionData = new SessionData();
  message: Subject<SessionEventMessage> =
    new ReplaySubject<SessionEventMessage>(1);
  constructor(private apiService: ApiService) {}

  getEventMessage() {
    return this.message;
  }

  getData() {
    return this.session;
  }

  refresh() {
    this.apiService
      .getTransactions()
      .subscribe((transactions: TransactionsResponse) => {
        this.session.incomes = transactions.income;
        this.session.saving = transactions.saving;
        this.session.expenses = transactions.expense;
        this.session.payments = transactions.payment;
        this.session.destinations = transactions.destinations
        console.log(this.session)
        this.message.next(SessionEventMessage.INIT_SESSION_LOAD_SUCCESS);
      });
  }

  updateIncome(payload: IncomeRequest) {
    this.apiService.updateIncome(payload).subscribe((income: Income) => {
      if (income) {
        //this.updateSessionIncome(income);
        this.message.next(
          SessionEventMessage.SESSION_TRANSACTION_UPDATE_SUCCESS,
        );
      } else {
        this.message.next(
          SessionEventMessage.SESSION_TRANSACTION_UPDATE_FAILED,
        );
      }
    });
  }

  updateTransaction(payload: TransactionRequest) {
    this.apiService
      .updateTransaction(payload)
      .subscribe((transaction: TransactionExpand) => {
        if (transaction) {
          this.syncSessionTransaction(transaction, this.session.expenses);
          let source = this.getTargetTransactionCategory(transaction);
          this.syncSessionTransaction(transaction, source);

          this.message.next(
            SessionEventMessage.SESSION_TRANSACTION_UPDATE_SUCCESS,
          );
        } else {
          this.message.next(
            SessionEventMessage.SESSION_TRANSACTION_UPDATE_FAILED,
          );
        }
      });
  }

  private syncSessionTransaction(newData: TransactionExpand, source: MonthlyTransaction[]) {
    const idx = source.findIndex(
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
    } else {
      const transactionObject: MonthlyTransaction = {
        year: newData.year!,
        month: newData.month!,
        month_text: newData.month_text!,
        total: newData.amount!,
        transactions: [],
        transactions_cp: [],
      };
      transactionObject.transactions.push(newData);
      source.push(transactionObject);
    }
  }
  private getTargetTransactionCategory(payload: Transaction): MonthlyTransaction[] {
     if (payload.is_saving) {
      return this.session.saving;
    } else if (payload.is_payment) {
      return this.session.payments;
    } else {
      return this.session.incomes;
    }
  }

  private deleteMergedTransactions(data: Transaction) {
    // this.session.expenses.forEach(x => {
    //   x.transactions = x.transactions.filter(y => !data.merged_ids!.includes(y.id!))
    //   if ('transaction_cp' in x) {
    //     x.transactions_cp = x.transactions_cp.filter(y => !data.merged_ids!.includes(y.id!))
    //   }
    // });
    // let source = this.getTargetTransactionCategory(data);
    // source.forEach(x => {
    //   x.transactions = x.transactions.filter(y => !data.merged_ids!.includes(y.id!))
    //   if ('transaction_cp' in x) {
    //     x.transactions_cp = x.transactions_cp.filter(y => !data.merged_ids!.includes(y.id!))
    //   }
    // });
  }
}
