import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DestinationMap } from '../model/payee';
import { ClientSettings } from '../model/common';
import {
  TRANSACTION_TYPE_EXPENSE_ID,
  TRANSACTION_TYPE_INCOME_ID,
  TRANSACTION_TYPE_PAYMENTS_ID,
  TRANSACTION_TYPE_SAVINGS_ID,
} from '../../data/client.data';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private year$ = new BehaviorSubject<number>(new Date().getFullYear());
  private payees$ = new BehaviorSubject<DestinationMap[]>([]);
  private settings$ = new BehaviorSubject<ClientSettings>(
    this.getEmptyClientSettings(),
  );
  private valueVisible$ = new BehaviorSubject<boolean>(false);
  private refresher$ = new BehaviorSubject<boolean>(false);

  yearSwitch$ = this.year$.asObservable();
  refresh$ = this.refresher$.asObservable();
  valueVisibility$ = this.valueVisible$.asObservable();

  setClientSettings(clientSettings: ClientSettings) {
    this.settings$.next(clientSettings);
  }

  getClientSettings(): ClientSettings {
    return this.settings$.value;
  }

  setFilterYear(year: number) {
    this.year$.next(year);
  }

  setRefresh(value: boolean) {
    this.refresher$.next(value);
  }

  getFilterYear() {
    return this.year$.value;
  }

  setValueVisibility(value: boolean) {
    this.valueVisible$.next(value);
  }

  getValueVisibility() {
    return this.valueVisibility$;
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
  private getEmptyClientSettings(): ClientSettings {
    return {
      accounts: [],
      transaction_categories: [],
      transaction_sub_categories: [],
    };
  }


}
