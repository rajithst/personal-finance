import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  BulkDeleteRequest,
  BulkDeleteResponse,
  Transaction,
  TransactionExpand,
  TransactionFilter,
  TransactionMergeRequest,
  TransactionSplitRequest,
  TransactionSplitResponse,
  TransactionsResponse,
} from '../model/transactions';
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
  PayeeDetail,
  PayeeResponse,
} from '../model/payee';

import { DashboardResponse } from '../model/dashboard';
import { ClientSettings } from '../model/common';
import {
  CategorySettingsRequest,
  CategorySettingsResponse,
} from '../model/category-settings';
import { MyProfile } from '../model/profile';
import { UserToken } from '../auth/model';
import { CreditAccount, CreditAccountRequest } from '../model/account';

new HttpHeaders({
  'Content-Type': 'application/json',
});

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private SRC_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  login(loginPayload: {
    username: string;
    password: string;
  }): Observable<UserToken> {
    return this.http.post<UserToken>(
      `${this.SRC_URL}/auth/jwt/create`,
      loginPayload,
    );
  }

  getDashboard(): Observable<DashboardResponse> {
    return this.http.get<DashboardResponse>(
      `${this.SRC_URL}/finance/dashboard/`,
    );
  }

  getTransactions(
    payload: TransactionFilter,
  ): Observable<TransactionsResponse> {
    const year = payload.year;
    const target = payload.target;
    const categories = payload.categories ? payload.categories.join(',') : '';
    const subcategories = payload.subcategories
      ? payload.subcategories.join(',')
      : '';
    return this.http.get<TransactionsResponse>(
      `${this.SRC_URL}/finance/transaction/?year=${year}&target=${target}&cat=${categories}&subcat=${subcategories}`,
    );
  }

  getPayees(): Observable<PayeeResponse> {
    return this.http.get<PayeeResponse>(`${this.SRC_URL}/finance/payee/`);
  }

  getPayeeDetail(payeeId: number | string): Observable<PayeeDetail> {
    return this.http.get<PayeeDetail>(
      `${this.SRC_URL}/finance/payee-detail/${payeeId}/`,
    );
  }

  getPayeeDetailByName(payeeName: string): Observable<PayeeDetail> {
    return this.http.get<PayeeDetail>(
      `${this.SRC_URL}/finance/payee-detail/${payeeName}/`,
    );
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

  splitTransaction(
    payload: TransactionSplitRequest,
  ): Observable<TransactionSplitResponse> {
    return this.http.put<TransactionSplitResponse>(
      `${this.SRC_URL}/finance/bulk/transaction/`,
      payload,
    );
  }

  updatePayeeRules(payload: DestinationMapRequest): Observable<DestinationMap> {
    if (payload.id) {
      return this.http.put<DestinationMap>(
        `${this.SRC_URL}/finance/payee/`,
        payload,
      );
    } else {
      return this.http.post<DestinationMap>(
        `${this.SRC_URL}/finance/payee/`,
        payload,
      );
    }
  }

  bulkDeleteTransactions(payload: BulkDeleteRequest) {
    return this.http.put<BulkDeleteResponse>(
      `${this.SRC_URL}/finance/bulk/transaction/`,
      payload,
    );
  }

  uploadTransactions(formData: FormData) {
    return this.http.post(
      `${this.SRC_URL}/finance/import/transactions/`,
      formData,
      {
        reportProgress: true,
        observe: 'events',
      },
    );
  }

  getMyProfile() {
    return this.http.get<MyProfile>(`${this.SRC_URL}/oauth/profile/me/`);
  }

  updateCategory(payload: CategorySettingsRequest) {
    if (payload.category.id) {
      return this.http.put<CategorySettingsResponse>(
        `${this.SRC_URL}/finance/category-settings/`,
        payload,
      );
    } else {
      return this.http.post<CategorySettingsResponse>(
        `${this.SRC_URL}/finance/category-settings/`,
        payload,
      );
    }
  }

  initSettings(): Observable<ClientSettings> {
    return this.http.get<ClientSettings>(`${this.SRC_URL}/finance/settings/`);
  }

  /* Investment Module APIs*/

  getInvestments(): Observable<InvestmentResponse> {
    return this.http.get<InvestmentResponse>(
      `${this.SRC_URL}/investments/list`,
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
      `${this.SRC_URL}/investments/stock-summary/${payload}/`,
    );
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

  updateCreditAccount(
    payload: CreditAccountRequest,
  ): Observable<CreditAccount> {
    if (payload.id) {
      return this.http.put<CreditAccount>(
        `${this.SRC_URL}/finance/credit-account/`,
        payload,
      );
    } else {
      return this.http.post<CreditAccount>(
        `${this.SRC_URL}/finance/credit-account/`,
        payload,
      );
    }
  }
}
