import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom, map, Observable } from 'rxjs';
import {
  BulkDeleteRequest,
  MonthlyTransaction,
  Transaction,
  TransactionExpand,
  TransactionFilter,
  TransactionMergeRequest,
  TransactionSplitRequest,
} from '../finance/model/transactions';
import { environment } from '../../environments/environment';
import { Payee, PayeeUpdateRequest, PayeeDetail } from '../finance/model/payee';

import { DashboardResponse } from '../finance/model/dashboard';
import { ClientSettings } from '../finance/model/common';
import {
  CategorySettingsRequest,
  CategorySettingsResponse,
} from '../finance/model/category-settings';
import { JwtTokenResponse, MyProfile } from '../auth/model';
import { CreditAccount, CreditAccountRequest } from '../finance/model/account';
import { PortfolioPerformance } from '../investments/model/portfolio';
import { Holding } from '../investments/model/holding';
import { MonthlyDividend } from '../investments/model/dividend';
import {
  StockPriceHistory,
  StockPurchaseHistory,
  StockPurchaseRequest,
} from '../investments/model/stock';
import {
  CompanyInfo,
  InvestmentClientSettings,
} from '../investments/model/investment';

export interface BaseAPIResponse {
  status: boolean;
  message: string;
}

export interface APIResponse<T> extends BaseAPIResponse {
  data: T;
}

function mapToData<T>(response: APIResponse<T>): T {
  return response.data;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly SRC_URL = environment.apiUrl;
  private readonly http = inject(HttpClient);

  async login(loginPayload: {
    username: string;
    password: string;
  }): Promise<JwtTokenResponse> {
    const token$ = this.http.post<JwtTokenResponse>(
      `${this.SRC_URL}/auth/jwt/create`,
      loginPayload,
    );
    return await firstValueFrom(token$);
  }

  async getDashboard(year: number): Promise<DashboardResponse> {
    const dashboard$ = this.http.get<APIResponse<DashboardResponse>>(
      `${this.SRC_URL}/finance/dashboard/?year=${year}`,
    );
    return await firstValueFrom(dashboard$.pipe(map(mapToData)));
  }

  async getTransactions(
    payload: TransactionFilter,
  ): Promise<MonthlyTransaction[]> {
    const year = payload.year;
    const target = payload.target;
    const categories = payload.categories ? payload.categories.join(',') : '';
    const subcategories = payload.subcategories
      ? payload.subcategories.join(',')
      : '';
    const transactions$ = this.http.get<APIResponse<MonthlyTransaction[]>>(
      `${this.SRC_URL}/finance/transaction/?year=${year}&target=${target}&cat=${categories}&subcat=${subcategories}`,
    );
    return await firstValueFrom(transactions$.pipe(map(mapToData)));
  }

  async getPayees(): Promise<Payee[]> {
    const payees$ = this.http.get<APIResponse<Payee[]>>(
      `${this.SRC_URL}/finance/payee/`,
    );
    return await firstValueFrom(payees$.pipe(map(mapToData)));
  }

  async getPayeeDetail(payeeId: number | string): Promise<PayeeDetail> {
    const payee$ = this.http.get<APIResponse<PayeeDetail>>(
      `${this.SRC_URL}/finance/payee-detail/${payeeId}/`,
    );
    return await firstValueFrom(payee$.pipe(map(mapToData)));
  }

  async getPayeeDetailByName(payeeName: string): Promise<PayeeDetail> {
    const payee$ = this.http.get<APIResponse<PayeeDetail>>(
      `${this.SRC_URL}/finance/payee-detail/${payeeName}/`,
    );
    return await firstValueFrom(payee$.pipe(map(mapToData)));
  }

  async updateTransaction(payload: Transaction): Promise<TransactionExpand> {
    let updatedTransaction$;
    if (payload.id) {
      updatedTransaction$ = this.http.put<APIResponse<TransactionExpand>>(
        `${this.SRC_URL}/finance/transaction/${payload.id}/`,
        payload,
      );
    } else {
      updatedTransaction$ = this.http.post<APIResponse<TransactionExpand>>(
        `${this.SRC_URL}/finance/transaction/`,
        payload,
      );
    }
    return await firstValueFrom(updatedTransaction$.pipe(map(mapToData)));
  }

  async mergeTransaction(
    payload: TransactionMergeRequest,
  ): Promise<TransactionExpand> {
    const updatedTransaction$ = this.http.put<APIResponse<TransactionExpand>>(
      `${this.SRC_URL}/finance/transaction/${payload.id}/`,
      payload,
    );
    return await firstValueFrom(updatedTransaction$.pipe(map(mapToData)));
  }

  async splitTransaction(
    payload: TransactionSplitRequest,
  ): Promise<TransactionExpand[]> {
    const splitResponse$ = this.http.put<APIResponse<TransactionExpand[]>>(
      `${this.SRC_URL}/finance/bulk/transaction/`,
      payload,
    );
    return await firstValueFrom(splitResponse$.pipe(map(mapToData)));
  }

  async updatePayeeRules(payload: PayeeUpdateRequest): Promise<Payee> {
    let updatedPayee$;
    if (payload.id) {
      updatedPayee$ = this.http.put<APIResponse<Payee>>(
        `${this.SRC_URL}/finance/payee/`,
        payload,
      );
    } else {
      updatedPayee$ = this.http.post<APIResponse<Payee>>(
        `${this.SRC_URL}/finance/payee/`,
        payload,
      );
    }
    return await firstValueFrom(updatedPayee$.pipe(map(mapToData)));
  }

  async bulkDeleteTransactions(
    payload: BulkDeleteRequest,
  ): Promise<TransactionExpand[]> {
    const response$ = this.http.put<APIResponse<TransactionExpand[]>>(
      `${this.SRC_URL}/finance/bulk/transaction/`,
      payload,
    );
    return await firstValueFrom(response$.pipe(map(mapToData)));
  }

  uploadTransactions(formData: FormData): Observable<any> {
    return this.http.post(
      `${this.SRC_URL}/finance/import/transactions/`,
      formData,
      {
        reportProgress: true,
        observe: 'events' as const,
      },
    );
  }

  async getMyProfile(): Promise<MyProfile> {
    const profile$ = this.http.get<MyProfile>(
      `${this.SRC_URL}/oauth/profile/me/`,
    );
    return await firstValueFrom(profile$);
  }

  async updateCategory(
    payload: CategorySettingsRequest,
  ): Promise<CategorySettingsResponse> {
    let categorySettings$;
    if (payload.category.id) {
      categorySettings$ = this.http.put<APIResponse<CategorySettingsResponse>>(
        `${this.SRC_URL}/finance/category-settings/`,
        payload,
      );
    } else {
      categorySettings$ = this.http.post<APIResponse<CategorySettingsResponse>>(
        `${this.SRC_URL}/finance/category-settings/`,
        payload,
      );
    }

    return await firstValueFrom(categorySettings$.pipe(map(mapToData)));
  }

  async deleteCategory(categoryId: number): Promise<boolean> {
    const response$ = this.http.delete<APIResponse<boolean>>(
      `${this.SRC_URL}/finance/category-settings/${categoryId}/`,
    );
    return await firstValueFrom(response$.pipe(map(mapToData)));
  }

  async initSettings(): Promise<ClientSettings> {
    const settings$ = this.http.get<APIResponse<ClientSettings>>(
      `${this.SRC_URL}/finance/settings/`,
    );
    return await firstValueFrom(settings$.pipe(map(mapToData)));
  }

  async updateCreditAccount(
    payload: CreditAccountRequest,
  ): Promise<CreditAccount> {
    let creditAccount$;
    if (payload.id) {
      creditAccount$ = this.http.put<APIResponse<CreditAccount>>(
        `${this.SRC_URL}/finance/credit-account/`,
        payload,
      );
    } else {
      creditAccount$ = this.http.post<APIResponse<CreditAccount>>(
        `${this.SRC_URL}/finance/credit-account/`,
        payload,
      );
    }

    return await firstValueFrom(creditAccount$.pipe(map(mapToData)));
  }

  /* Investment Module APIs*/

  async initInvestmentSettings(): Promise<InvestmentClientSettings> {
    const settings$ = this.http.get<APIResponse<InvestmentClientSettings>>(
      `${this.SRC_URL}/investments/settings/`,
    );
    return await firstValueFrom(settings$.pipe(map(mapToData)));
  }

  async getPortfolioPerformance(
    portfolio: number,
  ): Promise<PortfolioPerformance> {
    const portfolio$ = this.http.get<APIResponse<PortfolioPerformance>>(
      `${this.SRC_URL}/investments/dashboard/?portfolio=${portfolio}`,
    );
    return await firstValueFrom(portfolio$.pipe(map(mapToData)));
  }

  async getHoldings(portfolio: number): Promise<Holding[]> {
    const holdings$ = this.http.get<APIResponse<Holding[]>>(
      `${this.SRC_URL}/investments/holdings/?portfolio=${portfolio}`,
    );
    return await firstValueFrom(holdings$.pipe(map(mapToData)));
  }

  async getDividends(portfolio: number): Promise<MonthlyDividend[]> {
    const dividends$ = this.http.get<APIResponse<MonthlyDividend[]>>(
      `${this.SRC_URL}/investments/dividends/income/?portfolio=${portfolio}`,
    );
    return await firstValueFrom(dividends$.pipe(map(mapToData)));
  }

  async getStockPurchaseHistory(
    portfolio: number,
  ): Promise<StockPurchaseHistory[]> {
    const history$ = this.http.get<APIResponse<StockPurchaseHistory[]>>(
      `${this.SRC_URL}/investments/stocks/purchase/history/?portfolio=${portfolio}`,
    );
    return await firstValueFrom(history$.pipe(map(mapToData)));
  }

  async getStockPriceHistory(payload: string): Promise<StockPriceHistory> {
    const history$ = this.http.get<APIResponse<StockPriceHistory>>(
      `${this.SRC_URL}/investments/stocks/price/history/?company=${payload}/`,
    );
    return await firstValueFrom(history$.pipe(map(mapToData)));
  }

  async updateStockPurchase(payload: StockPurchaseRequest): Promise<Holding> {
    let updatedHolding$;
    if (payload.id) {
      updatedHolding$ = this.http.put<APIResponse<Holding>>(
        `${this.SRC_URL}/investments/stocks/purchase/history/`,
        payload,
      );
    } else {
      updatedHolding$ = this.http.post<APIResponse<Holding>>(
        `${this.SRC_URL}/investments/stocks/purchase/history/`,
        payload,
      );
    }
    return await firstValueFrom(updatedHolding$.pipe(map(mapToData)));
  }

  async getCompanies(): Promise<CompanyInfo[]> {
    const companies$ = this.http.get<APIResponse<CompanyInfo[]>>(
      `${this.SRC_URL}/investments/company/list`,
    );
    return firstValueFrom(companies$.pipe(map(mapToData)));
  }

  uploadHoldingTransactions(formData: FormData): Observable<any> {
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
