import { Injectable } from '@angular/core';
import {
  MonthlyTransaction,
  TransactionExpand,
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

}

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private session: SessionData = new SessionData();

  getData() {
    return this.session;
  }


  setPayeeSessionData(payeeData: DestinationMap[]) {
    this.session.payees = payeeData;
  }



  deleteMergedTransactions(transactions: TransactionExpand[], target: string) {
    // transactions.forEach((transaction: TransactionExpand) => {
    //   let [source, idx, expId] = this.getTargetTransactionIds(transaction, target)
    //   if (idx !== -1) {
    //     if (expId !== -1) {
    //       source[idx].transactions.splice(expId, 1);
    //     }
    //   }
    // })

  }




}
