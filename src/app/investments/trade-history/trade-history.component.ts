import { Component, OnInit } from '@angular/core';
import { SessionService } from '../service/session.service';
import { StockPurchaseHistory } from '../model/investment';

@Component({
  selector: 'app-trade-history',
  templateUrl: './trade-history.component.html',
  styleUrl: './trade-history.component.css',
})
export class TradeHistoryComponent implements OnInit {
  usTrades: StockPurchaseHistory[] = [];
  domesticTrades: StockPurchaseHistory[] = [];
  private sessionData = this.sessionService.getData();

  constructor(private sessionService: SessionService) {}

  ngOnInit(): void {
    this.usTrades = this.sessionData.transactions.filter(
      (x) => x.stock_currency === '$',
    );
    this.domesticTrades = this.sessionData.transactions.filter(
      (x) => x.stock_currency === '¥',
    );
  }
}
