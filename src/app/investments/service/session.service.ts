import { Injectable } from '@angular/core';
import { ReplaySubject, Subject } from 'rxjs';
import {ApiService} from "../../core/api.service";


export class SessionData {
  holdings: any[] = [];
  dividends: any[] = [];
  transactions: any[] = [];
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
    console.log('getting investment data...')
    this.apiService.getInvestments().subscribe(data => {
      this.session.holdings = data.holdings;
      this.session.dividends = data.dividends;
      this.session.transactions = data.transactions;
      console.log(this.session)
    })
  }

}
