import {Component, input, OnChanges, SimpleChanges} from '@angular/core';
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
import { StockPurchaseHistory } from '../../model/investment';
import { DecimalPipe } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { MatMenuTrigger, MatMenu, MatMenuItem } from '@angular/material/menu';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { MatCard, MatCardContent } from '@angular/material/card';

@Component({
  selector: 'app-purchase-history-table',
  templateUrl: './trade-history-table.component.html',
  styleUrl: './trade-history-table.component.scss',
  standalone: true,
  imports: [
    MatCard,
    MatCardContent,
    MatTable,
    MatSort,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatSortHeader,
    MatCellDef,
    MatCell,
    MatMenuTrigger,
    FaIconComponent,
    MatMenu,
    MatMenuItem,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    DecimalPipe,
  ],
})
export class TradeHistoryTableComponent implements OnChanges {
  purchaseHistory = input.required<StockPurchaseHistory[] | null>();
  displayedColumns: string[] = [
    'Stock',
    'Date',
    'Shares',
    'Industry',
    'Sector',
    'Price',
    'CurrentShareValue',
    'TotalProfit',
    'Actions',
  ];
  dataSource = new MatTableDataSource<StockPurchaseHistory>();

  ngOnChanges(changes: SimpleChanges): void {
    //this.dataSource = new MatTableDataSource<StockPurchaseHistory>(this.trades);
  }
}
