import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DestinationMap } from '../finance/model/payee';
import { ClientSettings } from '../finance/model/common';
import {
  TRANSACTION_TYPE_EXPENSE_ID,
  TRANSACTION_TYPE_INCOME_ID,
  TRANSACTION_TYPE_PAYMENTS_ID,
  TRANSACTION_TYPE_SAVINGS_ID,
} from '../shared/data/client.data';
import { MyProfile } from '../finance/model/profile';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private readonly payees$ = new BehaviorSubject<DestinationMap[]>([]);
  private readonly settings$ = new BehaviorSubject<ClientSettings>(
    this.getEmptyClientSettings(),
  );
  private readonly valueVisible$ = new BehaviorSubject<boolean>(false);
  valueVisibility$ = this.valueVisible$.asObservable();
  private readonly refresher$ = new BehaviorSubject<boolean>(false);
  refresh$ = this.refresher$.asObservable();
  private readonly profile$ = new BehaviorSubject<MyProfile | null>(null);

  private readonly filterYear$ = new BehaviorSubject<number>(new Date().getFullYear());
  year$ = this.filterYear$.asObservable();

  getFilterYear() {
    return this.filterYear$.value;
  }

  setFilterYear(year: number) {
    this.filterYear$.next(year);
  }

  setClientSettings(clientSettings: ClientSettings) {
    this.settings$.next(clientSettings);
  }

  getClientSettings(): ClientSettings {
    return this.settings$.value;
  }

  setRefresh(value: boolean) {
    this.refresher$.next(value);
  }

  setValueVisibility(value: boolean) {
    this.valueVisible$.next(value);
  }

  setPayees(payees: DestinationMap[]) {
    this.payees$.next(payees);
  }

  getPayees(): DestinationMap[] {
    return this.payees$.value;
  }

  getAllCategories() {
    return this.getClientSettings().transaction_categories;
  }

  getAllSubCategories() {
    return this.getClientSettings().transaction_sub_categories;
  }

  getAccounts() {
    return this.getClientSettings().accounts;
  }

  getExpenseCategories() {
    return this.getClientSettings().transaction_categories.filter(
      (x) => x.category_type === TRANSACTION_TYPE_EXPENSE_ID,
    );
  }

  getIncomeCategories() {
    return this.getClientSettings().transaction_categories.filter(
      (x) => x.category_type === TRANSACTION_TYPE_INCOME_ID,
    );
  }

  getSavingsCategories() {
    return this.getClientSettings().transaction_categories.filter(
      (x) => x.category_type === TRANSACTION_TYPE_SAVINGS_ID,
    );
  }

  getPaymentCategories() {
    return this.getClientSettings().transaction_categories.filter(
      (x) => x.category_type === TRANSACTION_TYPE_PAYMENTS_ID,
    );
  }

  setMyProfile(myProfile: MyProfile) {
    this.profile$.next(myProfile);
  }

  getMyProfile() {
    return this.profile$.value;
  }

  private getEmptyClientSettings(): ClientSettings {
    return {
      accounts: [],
      transaction_categories: [],
      transaction_sub_categories: [],
    };
  }


}
