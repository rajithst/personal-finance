import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TransactionExpand, TransactionFilter } from '../model/transactions';
import {DestinationMap} from "../model/payee";

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private year$ = new BehaviorSubject<number>(2024);
  private filterParams$ = new BehaviorSubject<TransactionFilter | null>(null);
  private bulkSelect$ = new BehaviorSubject<TransactionExpand[]>([]);
  private panels$ = new BehaviorSubject<boolean>(false);
  private payees$ = new BehaviorSubject<DestinationMap[]>([]);

  yearSwitch$ = this.year$.asObservable();
  transactionFilters$ = this.filterParams$.asObservable();
  bulkSelectTransaction$ = this.bulkSelect$.asObservable();
  expandPanels$ = this.panels$.asObservable();

  setFilterYear(year: number) {
    this.year$.next(year);
  }

  getFilterYear() {
    return this.year$.value;
  }

  setFilterParams(filters: TransactionFilter) {
    this.filterParams$.next(filters);
  }

  setPayees(payees: DestinationMap[]) {
    this.payees$.next(payees)
  }

  getPayees(): DestinationMap[] {
    return this.payees$.value;
  }
  getFilterParams() {
    return this.filterParams$.value
      ? this.filterParams$.value
      : this.getEmptyFilterParams();
  }

  setPanelActions(allExpanded: boolean) {
    this.panels$.next(allExpanded);
  }

  setBulkSelectTransactions(selected: TransactionExpand[]) {
    this.bulkSelect$.next(selected);
  }

  getEmptyFilterParams(): TransactionFilter {
    return {
      year: this.year$.value,
      target: '',
      categories: [],
      subcategories: [],
      paymentMethods: [],
    };
  }

  clearTransactionFilters() {
    this.filterParams$.next(this.getEmptyFilterParams())
  }

  clearAllFiltersAndSelections() {
    this.clearTransactionFilters();
    this.bulkSelect$.next([]);
    this.panels$.next(false);
  }
}
