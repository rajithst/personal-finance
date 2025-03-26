import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private readonly valueVisible$ = new BehaviorSubject<boolean>(false);
  valueVisibility$ = this.valueVisible$.asObservable();

  private readonly refresher$ = new BehaviorSubject<boolean>(false);
  refresh$ = this.refresher$.asObservable();

  private readonly filterYear$ = new BehaviorSubject<number>(
    new Date().getFullYear(),
  );
  year$ = this.filterYear$.asObservable();

  private readonly portfolioSwitch$ = new BehaviorSubject<number | null>(null);
  portfolioSwitcher = this.portfolioSwitch$.asObservable();

  private readonly searchBar$ = new BehaviorSubject<string | null>(null);
  search$ = this.searchBar$.asObservable();

  getFilterYear() {
    return this.filterYear$.value;
  }

  setFilterYear(year: number) {
    this.filterYear$.next(year);
  }

  setRefresh(value: boolean) {
    this.refresher$.next(value);
  }

  setValueVisibility(value: boolean) {
    this.valueVisible$.next(value);
  }

  setPortfolioSwitch(portfolioId: number) {
    this.portfolioSwitch$.next(portfolioId);
  }

  setSearchQuery(query: string) {
    this.searchBar$.next(query);
  }
}
