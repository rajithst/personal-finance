import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { PurchaseHistoryTableComponent } from './purchase-history-table/purchase-history-table.component';
import { AsyncPipe } from '@angular/common';
import { Observable, of, ReplaySubject, takeUntil } from 'rxjs';
import { ApiService } from '../../core/api.service';
import { StockPurchaseHistory } from '../model/stock';
import { InvestmentStore } from '../../core/store/investment.store';
import { DataService } from '../../service/data.service';

@Component({
  selector: 'app-purchase-history',
  template: `
    <app-purchase-history-table
      [purchaseHistory]="purchaseHistory$ | async"
    ></app-purchase-history-table>
  `,
  styles: ``,
  imports: [PurchaseHistoryTableComponent, AsyncPipe],
})
export class PurchaseHistoryComponent implements OnInit, OnDestroy {
  private readonly apiService = inject(ApiService);
  private readonly destroyed$ = new ReplaySubject<void>(1);
  private readonly store = inject(InvestmentStore);
  private readonly dataService = inject(DataService);
  purchaseHistory$: Observable<StockPurchaseHistory[]>;

  ngOnInit(): void {
    this.dataService.portfolioSwitcher
      .pipe(takeUntil(this.destroyed$))
      .subscribe((portfolioId) => {
        if (!portfolioId) {
          return;
        }
        this.getPurchaseHistory(portfolioId).then();
      });
  }

  async getPurchaseHistory(portfolioId: number) {
    await this.apiService
      .getStockPurchaseHistory(portfolioId)
      .then((purchaseHistory) => {
        this.purchaseHistory$ = of(purchaseHistory);
      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
