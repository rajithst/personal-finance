import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Income, IncomeList, MonthlyIncome } from '../finance/income/income.data';
import { ReplaySubject, Subject } from 'rxjs';

export class SessionData {
  sessionIncomes: IncomeList[] =  [];
  sessionSavings: [] = [];
}

export enum SessionEventMessage {
  INIT_SESSION_LOAD_SUCCESS,
  INIT_SESSION_LOAD_FAILED,
  INIT_BORADCAST
}

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  session: SessionData  = new SessionData()
  message: Subject<SessionEventMessage> = new ReplaySubject<SessionEventMessage>(1)
  constructor(private apiService: ApiService) {}

  getEventMessage() {
    return this.message;
  }

  getData() {
    return this.session;
  }

  refresh() {
    this.apiService.getIncome().subscribe((incomes) => {
      this.session.sessionIncomes = this.linkIncomeData(incomes)
      this.message.next(SessionEventMessage.INIT_SESSION_LOAD_SUCCESS)
    })
  }


  private linkIncomeData(incomes: Income[]) {
    const monthlyIncomesMap: Map<string, IncomeList> = new Map();
    incomes.forEach(model => {
        const key = `${model.year}-${model.month_text}`;
        if (!monthlyIncomesMap.has(key)) {
            monthlyIncomesMap.set(key, {
                year: model.year,
                month: model.month_text,
                incomes: []
            });
        }
        const incomeData: MonthlyIncome = {
            date: model.date,
            source: model.category.toString(),
            amount: model.amount
        };
        const monthlyIncome = monthlyIncomesMap.get(key);
        if (monthlyIncome) {
            monthlyIncome.incomes.push(incomeData);
        }
    });
    return Array.from(monthlyIncomesMap.values());
  }

}
