import { Injectable } from '@angular/core';
import {
  CompanyInfo,
  Holding, InvestmentResponse,
  StockPurchaseHistory,
} from '../model/investment';

export interface SessionDividend {
  us: any[];
  domestic: any[];
}

export class SessionData {
  holdings: Holding[] = [];
  dividends: SessionDividend = { us: [], domestic: [] };
  transactions: StockPurchaseHistory[] = [];
  companies: CompanyInfo[] = [];
}

@Injectable()
export class SessionService {
  private session: SessionData = new SessionData();
  getData() {
    return this.session;
  }

  setSessionData(data: InvestmentResponse) {
    this.session.holdings = data.holdings;
    this.session.dividends = data.dividends;
    this.session.transactions = data.transactions;
  }

  replaceHoldings(holding: Holding) {
    const idx = this.session.holdings.findIndex(x => x.company === holding.company);
    if (idx !== -1) {
      this.session.holdings[idx] = holding;
    }
  }

  addHolding(holding: Holding) {
    this.session.holdings.push(holding);
  }

  deleteHolding(holding: Holding) {
    const idx = this.session.holdings.findIndex(x => x.company === holding.company);
    if (idx !== -1) {
      this.session.holdings.splice(idx, 1);
    }
  }

  addStockPurchase(purchase_history: StockPurchaseHistory) {
    this.session.transactions.unshift(purchase_history);
  }
}
