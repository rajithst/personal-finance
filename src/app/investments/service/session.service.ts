import { Injectable } from '@angular/core';
import { ReplaySubject, Subject } from 'rxjs';
import {ApiService} from "../../core/api.service";
import {StockPurchase} from "../model/transaction";

export interface SessionDividend {
  us: any[],
  domestic: any[]
}

export class SessionData {
  holdings: any[] = [];
  dividends: SessionDividend = {us: [], domestic: []};
  transactions: any[] = [];
  companies: any[] = [];
}

export enum SessionEventMessage {

}

@Injectable()
export class SessionService {
  private session: SessionData = new SessionData();
  message: Subject<SessionEventMessage> =
    new ReplaySubject<SessionEventMessage>(1);
  constructor(private apiService: ApiService) {}

  getEventMessage() {
    return this.message;
  }

  getData() {
    return this.session;
  }

  refresh() {
    this.apiService.getInvestments().subscribe(data => {
      this.session.companies = data.companies;
      this.session.holdings = data.holdings;
      this.session.dividends = data.dividends;
      this.session.transactions = data.transactions;
    })
  }

  updateStockPurchaseHistory(payload: StockPurchase) {
    this.apiService.updateStockPurchaseHistory(payload).subscribe(data => {
    })
  }
}
