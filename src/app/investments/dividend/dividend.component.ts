import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { DividendTableComponent } from './dividend-table/dividend-table.component';
import { Observable, of, ReplaySubject, takeUntil } from 'rxjs';
import { ApiService } from '../../core/api.service';
import { AsyncPipe } from '@angular/common';
import { MonthlyDividend } from '../model/dividend';
import { DataService } from '../../service/data.service';

@Component({
  selector: 'app-dividend',
  template: `<app-dividend-table
    [dividends]="dividends$ | async"
  ></app-dividend-table>`,
  styles: ``,
  imports: [DividendTableComponent, AsyncPipe],
})
export class DividendComponent implements OnInit, OnDestroy {
  private readonly apiService = inject(ApiService);
  private readonly destroyed$ = new ReplaySubject<void>(1);
  private readonly dataService = inject(DataService);
  dividends$: Observable<MonthlyDividend[]>;

  ngOnInit(): void {
    this.dataService.portfolioSwitcher
      .pipe(takeUntil(this.destroyed$))
      .subscribe((portfolioId) => {
        if (!portfolioId) {
          return;
        }
        this.getDividends(portfolioId).then();
      });
  }

  async getDividends(portfolioId: number) {
    await this.apiService.getDividends(portfolioId).then((dividends) => {
      this.dividends$ = of(dividends);
    });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
