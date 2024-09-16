import {
  Component,
  inject,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatSort } from '@angular/material/sort';

import {
  faCaretDown,
  faCaretUp,
  faEllipsis,
  faJpy,
  faLineChart,
  faList,
  faMoneyBill,
  faPlus,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { HoldingDetailsComponent } from '../holding-details/holding-details.component';
import { SessionService } from '../../service/session.service';
import { Holding, StockDailyPrice } from '../../model/investment';
import { ApiService } from '../../../core/api.service';

@Component({
  selector: 'app-holding-table',
  templateUrl: './holding-table.component.html',
  styleUrl: './holding-table.component.css',
})
export class HoldingTableComponent implements OnChanges {
  @Input() holdings: Holding[] = [];
  @ViewChild(MatSort) sort: MatSort;
  totalShares: number = 0;
  totalInvestment: number = 0;
  totalCurrentPrice: number = 0;
  totalProfit: number = 0;
  totalProfitPercentage: number = 0;
  currency: string = 'USD';
  displayedColumns: string[] = [
    'Stock',
    'Shares',
    'CostPerShare',
    'CurrentShareValue',
    'TotalInvestment',
    'CurrentValue',
    'TotalProfit',
    'ShareInProtofolio',
    'Actions',
  ];
  dataSource = new MatTableDataSource<Holding>();
  protected readonly faCaretDown = faCaretDown;
  protected readonly faCaretUp = faCaretUp;
  protected readonly faLineChart = faLineChart;
  protected readonly faMoneyBill = faMoneyBill;
  protected readonly faEllipsis = faEllipsis;
  protected readonly faJpy = faJpy;
  protected readonly faPlus = faPlus;
  protected readonly faTrash = faTrash;
  protected readonly Math = Math;
  protected readonly faList = faList;
  private dialog = inject(MatDialog);
  private apiService = inject(ApiService);
  private sessionService = inject(SessionService);
  private sessionData = this.sessionService.getData();

  ngOnChanges(changes: SimpleChanges): void {
    this.currency =
      this.holdings.length > 0 ? this.holdings[0].stock_currency : '$';
    this.totalShares = this.holdings.reduce((ac, cv) => ac + cv['quantity'], 0);
    this.totalInvestment = this.holdings.reduce(
      (ac, cv) => ac + cv['total_investment'],
      0,
    );
    this.totalCurrentPrice = this.holdings.reduce(
      (ac, cv) => ac + cv['current_value'],
      0,
    );
    this.totalProfit = this.holdings.reduce(
      (ac, cv) => ac + cv['profit_loss'],
      0,
    );
    this.totalProfitPercentage =
      (this.totalProfit / this.totalInvestment) * 100;
    this.dataSource = new MatTableDataSource<Holding>(this.holdings);
    this.dataSource.sort = this.sort;
  }

  formatValue(value: number): string {
    const prefix = value > 0 ? '+' : '-';
    const formattedValue = Math.abs(value);
    return `${prefix} ${this.currency}${formattedValue.toFixed(2)}`;
  }

  openStockDetail(symbol: string) {
    let stockPriceHistory: StockDailyPrice[] = [];
    this.apiService.getStockPriceHistory(symbol).subscribe((value) => {
      stockPriceHistory = value.prices;
      this.openModal(symbol, stockPriceHistory);
    });
  }

  openModal(symbol: string, stockPriceHistory: StockDailyPrice[]) {
    const holdingData = this.holdings.find((h) => h.company === symbol);
    const transactions = this.sessionData.transactions;
    const purchaseHistory = transactions.filter((x) => x.company === symbol);
    const dialog = this.dialog.open(HoldingDetailsComponent, {
      width: '950px',
      position: {
        top: '50px',
      },
      data: { symbol: symbol, holdingData, purchaseHistory, stockPriceHistory },
    });
    dialog.afterClosed().subscribe((result) => {
      if (result) {
      }
    });
  }
}
