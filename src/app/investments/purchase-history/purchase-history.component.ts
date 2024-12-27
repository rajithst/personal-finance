import { Component, inject, OnInit } from '@angular/core';
import { PurchaseHistoryTableComponent } from './purchase-history-table/purchase-history-table.component';
import { AsyncPipe } from '@angular/common';
import { Observable, of } from 'rxjs';
import { ApiService } from '../../core/api.service';
import { StockPurchaseHistory } from '../model/stock';
import { InvestmentStore } from '../../core/store/investment.store';

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
export class PurchaseHistoryComponent implements OnInit {
  private readonly apiService = inject(ApiService);
  private readonly store = inject(InvestmentStore);
  purchaseHistory$: Observable<StockPurchaseHistory[]>;

  ngOnInit(): void {
    this.apiService
      .getStockPurchaseHistory(this.store.currentPortfolio()?.id ?? 0)
      .then((purchaseHistory) => {
        this.purchaseHistory$ = of(purchaseHistory);
      });
  }
}
