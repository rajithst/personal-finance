import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TradeDialogComponent } from '../trade-dialog/trade-dialog.component';
import {SessionService} from "../service/session.service";
import {
  faCaretUp,
  faLineChart,
  faCaretDown,
  faMoneyBill,
  faMoneyBillTrendUp, faJpy
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-holdings',
  templateUrl: './holdings.component.html',
  styleUrl: './holdings.component.css',
})
export class HoldingsComponent implements OnInit {
  protected readonly Math = Math;
  protected readonly faMoneyBill = faMoneyBill;
  protected readonly faMoneyBillTrendUp = faMoneyBillTrendUp;
  protected readonly faLineChart = faLineChart;
  protected readonly faCaretUp = faCaretUp;
  protected readonly faCaretDown = faCaretDown;
  protected readonly faJpy = faJpy;

  private sessionData = this.sessionService.getData();
  constructor(private dialog: MatDialog, private sessionService: SessionService) {}
  usHoldings: any[] = []
  domesticHoldings: any[] = []

  ngOnInit(): void {
    this.usHoldings = this.sessionData.holdings.filter(x => x.stock_currency === '$')
    this.domesticHoldings = this.sessionData.holdings.filter(x => x.stock_currency === '¥')
  }

  addTransaction() {
    this.dialog.open(TradeDialogComponent, {
      width: '750px',
      position: {
        top: '50px',
      },
      data: { formData: null, task: 'add' },
    });
  }




}
