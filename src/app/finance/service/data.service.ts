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
}
