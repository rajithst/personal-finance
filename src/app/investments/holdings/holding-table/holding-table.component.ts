import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {MatSort} from '@angular/material/sort';

import {
  faCaretDown,
  faCaretUp,
  faJpy,
  faLineChart,
  faMoneyBill,
} from '@fortawesome/free-solid-svg-icons';
import {MatTableDataSource} from "@angular/material/table";

@Component({
  selector: 'app-holding-table',
  templateUrl: './holding-table.component.html',
  styleUrl: './holding-table.component.css',
})
export class HoldingTableComponent implements OnChanges  {



  @Input() holdings: any[] = [];
  @ViewChild(MatSort) sort: MatSort;

  protected readonly faCaretDown = faCaretDown;
  protected readonly faCaretUp = faCaretUp;
  protected readonly faLineChart = faLineChart;
  protected readonly faMoneyBill = faMoneyBill;
  protected readonly faJpy = faJpy;
  protected readonly Math = Math;

  totalShares: number = 0;
  totalInvestment: number = 0;
  totalCurrentPrice: number = 0;
  totalProfit: number = 0;
  totalProfitPercentage: number = 0;
  currency: string = 'USD';
  displayedColumns: string[] = ['Stock', 'Shares', 'CostPerShare', 'CurrentShareValue', 'TotalInvestment', 'CurrentValue', 'TotalProfit', 'ShareInProtofolio'];
  dataSource = new MatTableDataSource();

  ngOnChanges(changes: SimpleChanges): void {
    this.currency = this.holdings.length > 0 ? this.holdings[0].stock_currency : '$';
    this.totalShares = this.holdings.reduce((ac, cv) => ac + cv['quantity'], 0);
    this.totalInvestment = this.holdings.reduce((ac, cv) => ac + cv['total_investment'], 0);
    this.totalCurrentPrice = this.holdings.reduce((ac, cv) => ac + cv['current_value'], 0);
    this.totalProfit = this.holdings.reduce((ac, cv) => ac + cv['profit_loss'], 0);
    this.totalProfitPercentage = (this.totalProfit/this.totalInvestment)*100;
    this.dataSource = new MatTableDataSource(this.holdings);
    this.dataSource.sort = this.sort;
  }



  formatValue(value: number): string {
    const prefix = value > 0 ? '+' : '-';
    const formattedValue = Math.abs(value);
    return `${prefix} ${this.currency}${formattedValue.toFixed(2)}`;
  }

}
