import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {SessionService} from "../service/session.service";


@Component({
  selector: 'app-holdings',
  templateUrl: './holdings.component.html',
  styleUrl: './holdings.component.css',
})
export class HoldingsComponent implements OnInit {
  private sessionData = this.sessionService.getData();
  constructor(private sessionService: SessionService) {}
  usHoldings: any[] = [];
  domesticHoldings: any[] = [];

  ngOnInit(): void {
    this.usHoldings = this.sessionData.holdings.filter(
      (x) => x.stock_currency === '$',
    );
    this.domesticHoldings = this.sessionData.holdings.filter(
      (x) => x.stock_currency === '¥',
    );
  }
}
