import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { PurchaseHistoryTableComponent } from './purchase-history-table/purchase-history-table.component';
import { AsyncPipe } from '@angular/common';
import { Observable, of, ReplaySubject, takeUntil } from 'rxjs';
import { ApiService } from '../../core/api.service';
import { StockPurchaseHistory } from '../model/stock';
import { DataService } from '../../service/data.service';
import { MatIcon } from '@angular/material/icon';
import { MatMiniFabButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { InvestmentStore } from '../../core/store/investment.store';

@Component({
  selector: 'app-purchase-history',
  template: `
    <div class="sub-toolbar">
      <div class="sub-toolbar-info"></div>
      <div class="sub-toolbar-actions">
        <button
          mat-mini-fab
          matTooltip="Add Dividend Payment"
          matTooltipPosition="below"
        >
          <mat-icon>add</mat-icon>
        </button>
      </div>
    </div>
    <app-purchase-history-table
      [purchaseHistory]="purchaseHistory$ | async"
    ></app-purchase-history-table>
  `,
  styles: ``,
  imports: [
    PurchaseHistoryTableComponent,
    AsyncPipe,
    MatIcon,
    MatMiniFabButton,
    MatTooltip,
  ],
})
export class PurchaseHistoryComponent implements OnInit, OnDestroy {
  private readonly apiService = inject(ApiService);
  private readonly destroyed$ = new ReplaySubject<void>(1);
  private readonly dataService = inject(DataService);
  private readonly store = inject(InvestmentStore);
  purchaseHistory$: Observable<StockPurchaseHistory[]> | null;

  ngOnInit(): void {
    this.getPurchaseHistory().then();
    this.dataService.portfolioSwitcher
      .pipe(takeUntil(this.destroyed$))
      .subscribe((portfolioId) => {
        if (!portfolioId) {
          return;
        }
        this.getPurchaseHistory().then();
      });
  }

  async getPurchaseHistory() {
    await this.apiService
      .getStockPurchaseHistory(this.store.currentPortfolio()?.id ?? 0)
      .then((purchaseHistory) => {
        this.purchaseHistory$ = of(purchaseHistory ?? []);
      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
