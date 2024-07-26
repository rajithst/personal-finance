import {computed, inject, Injectable, signal} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TransactionFilter } from '../model/transactions';
import { DestinationMap } from '../model/payee';
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private router = inject(Router)

  private year$ = new BehaviorSubject<number>(2024);
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
