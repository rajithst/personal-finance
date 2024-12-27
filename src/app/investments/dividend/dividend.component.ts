import { Component, inject, OnInit } from '@angular/core';
import { DividendTableComponent } from './dividend-table/dividend-table.component';
import { Observable, of } from 'rxjs';
import { ApiService } from '../../core/api.service';
import { AsyncPipe } from '@angular/common';
import { MonthlyDividend } from '../model/dividend';
import { InvestmentStore } from '../../core/store/investment.store';

@Component({
  selector: 'app-dividend',
  template: `<app-dividend-table
    [dividends]="dividends$ | async"
  ></app-dividend-table>`,
  styles: ``,
  imports: [DividendTableComponent, AsyncPipe],
})
export class DividendComponent implements OnInit {
  private readonly apiService = inject(ApiService);
  private readonly store = inject(InvestmentStore);
  dividends$: Observable<MonthlyDividend[]>;

  ngOnInit(): void {
    this.apiService
      .getDividends(this.store.currentPortfolio()?.id ?? 0)
      .then((dividends) => {
        this.dividends$ = of(dividends);
      });
  }
}
