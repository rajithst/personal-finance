import { Component, OnInit } from '@angular/core';
import { StockPurchaseHistory } from '../model/investment';
import { TradeHistoryTableComponent } from './trade-history-table/trade-history-table.component';
import { MatTabGroup, MatTab } from '@angular/material/tabs';

@Component({
  selector: 'app-trade-history',
  templateUrl: './trade-history.component.html',
  styleUrl: './trade-history.component.scss',
  standalone: true,
  imports: [MatTabGroup, MatTab, TradeHistoryTableComponent],
})
export class TradeHistoryComponent implements OnInit {
  usTrades: StockPurchaseHistory[] = [];
  domesticTrades: StockPurchaseHistory[] = [];

  ngOnInit(): void {
    // TODO document why this method 'ngOnInit' is empty
  }
}
