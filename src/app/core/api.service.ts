import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
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
} from '../finance/model/transactions';
import { environment } from '../../environments/environment';
import {
  DestinationMap,
  DestinationMapRequest,
  PayeeDetail,
  PayeeResponse,
} from '../finance/model/payee';

import { DashboardResponse } from '../finance/model/dashboard';
import { ClientSettings } from '../finance/model/common';
import {
  CategorySettingsRequest,
  CategorySettingsResponse,
} from '../finance/model/category-settings';
import { MyProfile } from '../finance/model/profile';
import { JwtTokenResponse } from '../auth/model';
import { CreditAccount, CreditAccountRequest } from '../finance/model/account';
import {
  Portfolio,
  PortfolioPerformance,
} from '../investments/model/portfolio';
import { Holding } from '../investments/model/holding';
import { MonthlyDividend } from '../investments/model/dividend';
import {
  StockPriceHistory,
  StockPurchaseHistory,
} from '../investments/model/stock';
import { CompanyInfo } from '../investments/model/investment';

export interface BaseAPIResponse {
  status: boolean;
  message: string;
}

export interface APIResponse<T> extends BaseAPIResponse {
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly SRC_URL = environment.apiUrl;
  private readonly http = inject(HttpClient);

  login(loginPayload: {
    username: string;
    password: string;
  }): Observable<JwtTokenResponse> {
    return this.http.post<JwtTokenResponse>(
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
        observe: 'events' as const,
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

  /* Investment Module APIs*/
  private mapToData<T>(response: APIResponse<T>): T {
    return response.data;
  }

  getPortfolios(): Observable<Portfolio[]> {
    return this.http
      .get<APIResponse<Portfolio[]>>(`${this.SRC_URL}/investments/portfolio/`)
      .pipe(map(this.mapToData));
  }

  getPortfolioPerformance(): Observable<PortfolioPerformance> {
    return this.http
      .get<
        APIResponse<PortfolioPerformance>
      >(`${this.SRC_URL}/investments/dashboard/`)
      .pipe(map(this.mapToData));
  }

  getHoldings(): Observable<Holding[]> {
    return this.http
      .get<APIResponse<Holding[]>>(`${this.SRC_URL}/investments/holdings/`)
      .pipe(map(this.mapToData));
  }

  getDividends(): Observable<MonthlyDividend[]> {
    return this.http
      .get<
        APIResponse<MonthlyDividend[]>
      >(`${this.SRC_URL}/investments/dividends/income/`)
      .pipe(map(this.mapToData));
  }

  getStockPurchaseHistory(): Observable<StockPurchaseHistory[]> {
    return this.http
      .get<
        APIResponse<StockPurchaseHistory[]>
      >(`${this.SRC_URL}/investments/stocks/purchase/history/`)
      .pipe(map(this.mapToData));
  }

  getStockPriceHistory(payload: string): Observable<StockPriceHistory> {
    return this.http
      .get<
        APIResponse<StockPriceHistory>
      >(`${this.SRC_URL}/investments/stocks/price/history/?company=${payload}/`)
      .pipe(map(this.mapToData));
  }

  // updateStockPurchase(
  //   payload: StockPurchase,
  // ): Observable<StockPurchaseResponse> {
  //   if (payload.id) {
  //     return this.http.put<StockPurchaseResponse>(
  //       `${this.SRC_URL}/investments/stock-purchase-history/${payload.id}/`,
  //       payload,
  //     );
  //   } else {
  //     return this.http.post<StockPurchaseResponse>(
  //       `${this.SRC_URL}/investments/stock-purchase-history/`,
  //       payload,
  //     );
  //   }
  // }

  getCompanies(): Observable<CompanyInfo[]> {
    return this.http
      .get<APIResponse<CompanyInfo[]>>(`${this.SRC_URL}/investments/company`)
      .pipe(map(this.mapToData));
  }

  uploadHoldingTransactions(formData: FormData) {
    return this.http.post(
      `${this.SRC_URL}/investments/stocks/purchases/upload/`,
      formData,
      {
        reportProgress: true,
        observe: 'events',
      },
    );
  }
}
