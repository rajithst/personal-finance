import {Component, inject, OnInit} from '@angular/core';
import {SessionService} from "../service/session.service";
import {Holding} from "../model/investment";


@Component({
  selector: 'app-holdings',
  templateUrl: './holdings.component.html',
  styleUrl: './holdings.component.css',
})
export class HoldingsComponent implements OnInit {
  private sessionService = inject(SessionService)
  private sessionData = this.sessionService.getData();
  usHoldings: Holding[] = [];
  domesticHoldings: Holding[] = [];

  ngOnInit(): void {
    this.usHoldings = this.sessionData.holdings.filter(
      (x) => x.stock_currency === '$',
    );
    this.domesticHoldings = this.sessionData.holdings.filter(
      (x) => x.stock_currency === '¥',
    );
  }
}
