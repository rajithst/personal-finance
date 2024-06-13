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
  updatedTransaction$ = this.transaction$.asObservable();
  updatedFilters$ = this.filters$.asObservable();
  triggerPanels$ = this.panelActions$.asObservable();

  setTransaction(transaction: TransactionExpand) {
    this.transaction$.next(transaction);
  }

  setFilters(filter = true) {
    this.filters$.next(filter);
  }

  setPanelActions(action: boolean) {
    this.panelActions$.next(action);
  }
}
