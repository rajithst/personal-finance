import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Income, IncomeRequest } from '../finance/model/income.data';
import {
  Transaction,
  TransactionsResponse,
} from '../finance/model/transactions';
import { InvestmentResponse } from '../investments/model/investment';
import { StockPurchase } from '../investments/model/transaction';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private SRC_URL = 'http://127.0.0.1:8000';

  constructor(private http: HttpClient) {}

  getTransactions(): Observable<TransactionsResponse> {
    return this.http.get<TransactionsResponse>(
      `${this.SRC_URL}/finance/transactions`,
    );
  }

  getInvestments(): Observable<InvestmentResponse> {
    return this.http.get<InvestmentResponse>(
      `${this.SRC_URL}/investments/list`,
    );
  }

  updateTransaction(payload: Transaction): Observable<Transaction> {
    return this.http.post<Transaction>(
      `${this.SRC_URL}/finance/transactions/`,
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
