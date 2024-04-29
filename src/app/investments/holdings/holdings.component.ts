import { Component, OnInit } from '@angular/core';
import { TransactionUpdateDialog } from '../../finance/transaction-update/transaction-update.component';
import { MatDialog } from '@angular/material/dialog';
import { TradeDialogComponent } from '../trade-dialog/trade-dialog.component';
import {SessionService} from "../service/session.service";
import {faCircleDown, faCircleUp} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-holdings',
  templateUrl: './holdings.component.html',
  styleUrl: './holdings.component.css',
})
export class HoldingsComponent implements OnInit {
  private sessionData = this.sessionService.getData();
  constructor(private dialog: MatDialog, private sessionService: SessionService) {}
  holdings: any[] = []
  faCircleUp = faCircleUp;
  faCircleDown = faCircleDown;
  totalShares: number = 0;
  totalInvestment: number = 0;
  totalCurrentPrice: number = 0;
  totalProfit: number = 0;
  totalProfitPercentage: number = 0;
  ngOnInit(): void {
    this.holdings = this.sessionData.holdings
    this.totalShares = this.holdings.reduce((ac, cv) => ac + cv['quantity'], 0);
    this.totalInvestment = this.holdings.reduce((ac, cv) => ac + cv['total_investment'], 0);
    this.totalCurrentPrice = this.holdings.reduce((ac, cv) => ac + cv['current_value'], 0);
    this.totalProfit = this.holdings.reduce((ac, cv) => ac + cv['profit_loss'], 0);
    this.totalProfitPercentage = (this.totalProfit/this.totalInvestment)*100;
  }

  addTransaction() {
    const dialog = this.dialog.open(TradeDialogComponent, {
      width: '750px',
      position: {
        top: '50px',
      },
      data: { formData: null, task: 'add' },
    });
  }

  protected readonly Math = Math;

}
