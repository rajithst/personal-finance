import { Injectable } from '@angular/core';

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
    console.log(this.session)
  }

}
