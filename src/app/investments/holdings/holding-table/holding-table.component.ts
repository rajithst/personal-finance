import {
  Component,
  computed,
  inject,
  input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatSort, MatSortHeader } from '@angular/material/sort';

import {
  MatTableDataSource,
  MatTable,
  MatColumnDef,
  MatHeaderCellDef,
  MatHeaderCell,
  MatCellDef,
  MatCell,
  MatHeaderRowDef,
  MatHeaderRow,
  MatRowDef,
  MatRow,
} from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { HoldingDetailsComponent } from '../holding-details/holding-details.component';
import { Holding, StockDailyPrice } from '../../model/investment';
import { ApiService } from '../../../core/api.service';
import { MatMenuTrigger, MatMenu, MatMenuItem } from '@angular/material/menu';
import { NgClass, DecimalPipe } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

interface TableElement {
  company_name: string;
  company_ticker: string;
  image: string;
  quantity: number;
  average_price: string;
  current_price: string;
  total_investment: string;
  current_value: string;
  profit_loss_value: number;
  profit_loss: string;
  profit_change_percentage: string;
  share_in_portfolio: string;
}

@Component({
  selector: 'app-holding-table',
  templateUrl: './holding-table.component.html',
  styleUrl: './holding-table.component.scss',
  standalone: true,
  imports: [
    MatCard,
    MatCardContent,
    FaIconComponent,
    NgClass,
    MatTable,
    MatSort,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatSortHeader,
    MatCellDef,
    MatCell,
    MatMenuTrigger,
    MatMenu,
    MatMenuItem,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    DecimalPipe,
    MatProgressSpinner,
  ],
})
export class HoldingTableComponent implements OnChanges {
  holdings = input.required<Holding[] | null>();
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = [
    'Stock',
    'Shares',
    'CostPerShare',
    'CurrentShareValue',
    'TotalInvestment',
    'CurrentValue',
    'TotalProfit',
    'ShareInPortfolio',
    'Actions',
  ];
  dataSource = new MatTableDataSource<TableElement>();
  private readonly dialog = inject(MatDialog);
  private readonly apiService = inject(ApiService);
  loading = computed(() => this.holdings() === null);
  noData = computed(() => !this.loading() && this.holdings()?.length === 0);

  ngOnChanges(changes: SimpleChanges): void {
    const tableData = this.formatData();
    this.dataSource = new MatTableDataSource<TableElement>(tableData ?? []);
    this.dataSource.sort = this.sort;
  }

  formatData() {
    const totalInvestment =
      this.holdings()?.reduce((ac, cv) => ac + cv['total_investment'], 0) ?? 0;
    const holdings = this.holdings();
    const formattedHoldings: TableElement[] = [];
    const valuePrefix = (value: number) => (value > 0 ? '+' : '-');
    const formattedValue = (value: number) => Math.abs(value).toFixed(2);

    holdings?.map((x) => {
      const holdingShare = (x.total_investment / totalInvestment) * 100;
      const obj: TableElement = {
        company_name: x.company_name,
        company_ticker: x.company,
        image: x.image,
        quantity: x.quantity,
        average_price: `${x.stock_currency}${formattedValue(x.average_price)}`,
        current_price: `${x.stock_currency}${formattedValue(x.current_price)}`,
        total_investment: `${x.stock_currency}${formattedValue(x.total_investment)}`,
        current_value: `${x.stock_currency}${formattedValue(x.current_value)}`,
        profit_loss_value: x.profit_loss,
        profit_loss: `${valuePrefix(x.profit_loss)}${x.stock_currency}${formattedValue(x.profit_loss)}`,
        profit_change_percentage: `${valuePrefix(x.profit_loss)}${x.stock_currency}${formattedValue(x.profit_change_percentage)}%`,
        share_in_portfolio: `${formattedValue(holdingShare)}%`,
      };
      formattedHoldings.push(obj);
    });
    return formattedHoldings;
  }

  formatValue(value: number, currency: string) {
    const prefix = value > 0 ? '+' : '-';
    const formattedValue = Math.abs(value);
    return `${prefix} ${currency}${formattedValue.toFixed(2)}`;
  }

  openStockDetail(symbol: string) {
    let stockPriceHistory: StockDailyPrice[] = [];
    this.apiService.getStockPriceHistory(symbol).subscribe((value) => {
      stockPriceHistory = value.prices;
      this.openModal(symbol, stockPriceHistory);
    });
  }

  openModal(symbol: string, stockPriceHistory: StockDailyPrice[]) {
    const holdingData = this.holdings()?.find((h) => h.company === symbol);
    const transactions = null;
    const purchaseHistory = null;
    const dialog = this.dialog.open(HoldingDetailsComponent, {
      width: '950px',
      position: {
        top: '50px',
      },
      data: { symbol: symbol, holdingData, purchaseHistory, stockPriceHistory },
    });
  }
}
