import { Injectable } from '@angular/core';
import {CompanyInfo, Holding, StockPurchaseHistory} from "../model/investment";

export interface SessionDividend {
  us: any[],
  domestic: any[]
}

export class SessionData {
  holdings: Holding[] = [];
  dividends: SessionDividend = {us: [], domestic: []};
  transactions: StockPurchaseHistory[] = [];
  companies: CompanyInfo[] = [];
}


@Injectable()
export class SessionService {
  private session: SessionData = new SessionData();
  getData() {
    return this.session;
  }

  setSessionData(data: any) {
    this.session.companies = data.companies;
    this.session.holdings = data.holdings;
    this.session.dividends = data.dividends;
    this.session.transactions = data.transactions;
  }

}
