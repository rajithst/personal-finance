import {
  Component,
  computed,
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
import { MatMenuTrigger, MatMenu, MatMenuItem } from '@angular/material/menu';
import { NgClass } from '@angular/common';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatIcon } from '@angular/material/icon';
import { Holding } from '../../model/holding';
import { NorecordsComponent } from '../../../components/norecords/norecords.component';

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
  imports: [
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
    MatIcon,
    NorecordsComponent,
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
        profit_change_percentage: `${formattedValue(x.profit_change_percentage)}%`,
        share_in_portfolio: `${formattedValue(holdingShare)}%`,
      };
      formattedHoldings.push(obj);
    });
    return formattedHoldings;
  }
}
