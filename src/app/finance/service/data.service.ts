import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DestinationMap } from '../model/payee';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private year$ = new BehaviorSubject<number>(new Date().getFullYear());
  private payees$ = new BehaviorSubject<DestinationMap[]>([]);

  yearSwitch$ = this.year$.asObservable();

  setFilterYear(year: number) {
    this.year$.next(year);
  }

  getFilterYear() {
    return this.year$.value;
  }

  setPayees(payees: DestinationMap[]) {
    this.payees$.next(payees);
  }

  getPayees(): DestinationMap[] {
    return this.payees$.value;
  }
}
