import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TransactionExpand } from '../model/transactions';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private transaction$ = new BehaviorSubject<TransactionExpand | null>(null);
  private filters$ = new BehaviorSubject<boolean | null>(null);
  private panelActions$ = new BehaviorSubject<boolean | null>(null);
  private year$ = new BehaviorSubject<number>(2024)
  private bulkSelect$ = new BehaviorSubject<TransactionExpand[]>([])
  private searchQuery$ = new BehaviorSubject<string>('')
  updatedTransaction$ = this.transaction$.asObservable();
  updatedFilters$ = this.filters$.asObservable();
  triggerPanels$ = this.panelActions$.asObservable();
  yearSwitch$ = this.year$.asObservable();
  bulkSelectTransaction$ = this.bulkSelect$.asObservable();
  searchTransaction$ = this.searchQuery$.asObservable();

  setTransaction(transaction: TransactionExpand) {
    this.transaction$.next(transaction);
  }

  setFilters(filter = true) {
    this.filters$.next(filter);
  }

  setPanelActions(action: boolean) {
    this.panelActions$.next(action);
  }

  setFilterYear(year: number) {
    this.year$.next(year)
  }

  setBulkSelectTransactions(transactions: TransactionExpand[]) {
    this.bulkSelect$.next(transactions)
  }

  setSearchQuery(query: string) {
    this.searchQuery$.next(query)
  }
}
