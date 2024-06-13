import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Income, IncomeRequest } from '../finance/model/income.data';
import {
  Transaction,
  TransactionExpand,
  TransactionsResponse,
} from '../finance/model/transactions';
import { InvestmentResponse } from '../investments/model/investment';
import { StockPurchase } from '../investments/model/transaction';
import { environment } from '../../environments/environment';

new HttpHeaders({
  'Content-Type': 'application/json',
});

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private SRC_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getTransactions(): Observable<TransactionsResponse> {
    return this.http.get<TransactionsResponse>(
      `${this.SRC_URL}/finance/list`,
    );
  }

  async fetchTransactions(): Promise<TransactionsResponse> {
    const response = await fetch(`${this.SRC_URL}/finance/list`);
    return await response.json();
  }

  getInvestments(): Observable<InvestmentResponse> {
    return this.http.get<InvestmentResponse>(
      `${this.SRC_URL}/investments/list`,
    );
  }

  updateTransaction(payload: Transaction): Observable<TransactionExpand> {
    if (payload.id) {
      return this.http.put<TransactionExpand>(
        `${this.SRC_URL}/finance/transaction/${payload.id}/`,
        payload,
      );
    } else {
      return this.http.post<TransactionExpand>(`${this.SRC_URL}/finance/transaction/`, payload)
    }

  }

  mergeTransaction(payload: Transaction): Observable<Transaction> {
    return this.http.post<Transaction>(
      `${this.SRC_URL}/finance/transactions/merge`,
      payload,
    );
  }

  updateIncome(payload: IncomeRequest): Observable<Income> {
    return this.http.post<Income>(
      `${this.SRC_URL}/transactions/income/`,
      payload,
    );
  }

  updateStockPurchaseHistory(payload: StockPurchase): Observable<any> {
    return this.http.post(`${this.SRC_URL}/investments/stock-purchase/`, payload)
  }
}
