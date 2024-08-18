import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DestinationMap } from '../model/payee';
import {ClientSettings} from "../model/common";

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private year$ = new BehaviorSubject<number>(new Date().getFullYear());
  private payees$ = new BehaviorSubject<DestinationMap[]>([]);
  private settings$ = new BehaviorSubject<ClientSettings>(this.getEmptyClientSettings());

  yearSwitch$ = this.year$.asObservable();
  clientSettings$ = this.settings$.asObservable();

  setClientSettings(clientSettings: ClientSettings) {
    this.settings$.next(clientSettings);
  }

  getClientSettings(): ClientSettings {
    return this.settings$.value;
  }

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

  private getEmptyClientSettings(): ClientSettings {
    return {
      accounts: [],
      income_categories: [],
      transaction_categories: [],
      transaction_sub_categories: []
    }
  }
}
