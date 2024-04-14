import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Income, IncomeRequest } from '../shared/interface/income.data';
import {Transaction, TransactionRequest, TransactionsResponse} from '../shared/interface/transactions';

const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
    })
};


@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private SRC_URL = 'http://127.0.0.1:8000/finance';


    constructor(private http: HttpClient) {}

    getTransactions(): Observable<TransactionsResponse> {
        return this.http.get<TransactionsResponse>(`${this.SRC_URL}/transactions`)
    }

    updateTransaction(payload: TransactionRequest): Observable<Transaction> {
      if (payload.id) {
        return this.http.put<Transaction>(`${this.SRC_URL}/transactions/${payload.id}/`, payload)
      } else {
        return this.http.post<Transaction>(`${this.SRC_URL}/transactions/`, payload)
      }
    }

    updateIncome(payload: IncomeRequest): Observable<Income> {
        if (payload.id) {
            return this.http.put<Income>(`${this.SRC_URL}/transactions/income/${payload.id}/`, payload)
        } else {
            return this.http.post<Income>(`${this.SRC_URL}/transactions/income/`, payload)
        }
    }


}
