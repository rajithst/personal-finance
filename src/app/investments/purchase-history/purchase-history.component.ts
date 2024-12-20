import { Component, inject, OnInit } from '@angular/core';
import { PurchaseHistoryTableComponent } from './purchase-history-table/purchase-history-table.component';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/api.service';
import { StockPurchaseHistory } from '../model/stock';

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
  purchaseHistory$: Observable<StockPurchaseHistory[]>;

  ngOnInit(): void {
    this.purchaseHistory$ = this.apiService.getStockPurchaseHistory();
  }
}
