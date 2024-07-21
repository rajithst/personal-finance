import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Income, IncomeRequest } from '../finance/model/income.data';
import {
  DashboardResponse,
  ExpenseResponse,
  Transaction,
  TransactionExpand,
  TransactionFilter,
  TransactionMergeRequest,
} from '../finance/model/transactions';
import {
  CompanyResponse,
  InvestmentResponse,
  StockDailyPriceResponse,
} from '../investments/model/investment';
import {
  StockPurchase,
  StockPurchaseResponse,
} from '../investments/model/transaction';
import { environment } from '../../environments/environment';
import {
  DestinationMap,
  DestinationMapRequest,
  PayeeResponse,
} from '../finance/model/payee';

new HttpHeaders({
  'Content-Type': 'application/json',
});

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private SRC_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getDashboard(): Observable<DashboardResponse> {
    return this.http.get<DashboardResponse>(
      `${this.SRC_URL}/finance/dashboard`,
    );
  }

  getTransactions(payload: TransactionFilter): Observable<ExpenseResponse> {
    const year = payload.year;
    const target = payload.target;
    const categories = payload.categories ? payload.categories.join(',') : '';
    const subcategories = payload.subcategories
      ? payload.subcategories.join(',')
      : '';
    return this.http.get<ExpenseResponse>(
      `${this.SRC_URL}/finance/transaction?year=${year}&target=${target}&cat=${categories}&subcat=${subcategories}`,
    );
  }

  getInvestments(): Observable<InvestmentResponse> {
    return this.http.get<InvestmentResponse>(
      `${this.SRC_URL}/investments/list`,
    );
  }

  getPayees(): Observable<PayeeResponse> {
    return this.http.get<PayeeResponse>(`${this.SRC_URL}/finance/payee`);
  }

  updateTransaction(payload: Transaction): Observable<TransactionExpand> {
    if (payload.id) {
      return this.http.put<TransactionExpand>(
        `${this.SRC_URL}/finance/transaction/${payload.id}/`,
        payload,
      );
    } else {
      return this.http.post<TransactionExpand>(
        `${this.SRC_URL}/finance/transaction/`,
        payload,
      );
    }
  }

  mergeTransaction(
    payload: TransactionMergeRequest,
  ): Observable<TransactionExpand> {
    return this.http.put<TransactionExpand>(
      `${this.SRC_URL}/finance/transaction/${payload.id}/`,
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
    return this.http.post(
      `${this.SRC_URL}/investments/stock-purchase/`,
      payload,
    );
  }

  getStockPriceHistory(payload: string): Observable<StockDailyPriceResponse> {
    return this.http.get<StockDailyPriceResponse>(
      `${this.SRC_URL}/investments/stock-daily-price/${payload}/`,
    );
  }

  updatePayeeRules(payload: DestinationMapRequest): Observable<DestinationMap> {
    if (payload.id) {
      return this.http.put<DestinationMap>(
        `${this.SRC_URL}/finance/payee/${payload.id}/`,
        payload,
      );
    } else {
      return this.http.post<DestinationMap>(
        `${this.SRC_URL}/finance/payee/`,
        payload,
      );
    }
  }

  updateStockPurchase(
    payload: StockPurchase,
  ): Observable<StockPurchaseResponse> {
    if (payload.id) {
      return this.http.put<StockPurchaseResponse>(
        `${this.SRC_URL}/investments/stock-purchase-history/${payload.id}/`,
        payload,
      );
    } else {
      return this.http.post<StockPurchaseResponse>(
        `${this.SRC_URL}/investments/stock-purchase-history/`,
        payload,
      );
    }
  }

  getCompanies(): Observable<CompanyResponse> {
    return this.http.get<CompanyResponse>(
      `${this.SRC_URL}/investments/company`,
    );
  }
}
