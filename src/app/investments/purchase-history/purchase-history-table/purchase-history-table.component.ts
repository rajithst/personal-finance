import {
  Component,
  computed,
  input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
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
import { DecimalPipe } from '@angular/common';
import { MatMenuTrigger, MatMenu, MatMenuItem } from '@angular/material/menu';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { StockPurchaseHistory } from '../../model/stock';

@Component({
  selector: 'app-purchase-history-table',
  templateUrl: './purchase-history-table.component.html',
  styleUrl: './purchase-history-table.component.scss',
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
export class PurchaseHistoryTableComponent implements OnChanges {
  purchaseHistory = input.required<StockPurchaseHistory[] | null>();
  displayedColumns: string[] = [
    'Stock',
    'Date',
    'Shares',
    'Industry',
    'Sector',
    'Price',
    'Actions',
  ];
  dataSource = new MatTableDataSource<StockPurchaseHistory>();
  loading = computed(() => this.purchaseHistory() === null);
  noData = computed(
    () => !this.loading() && this.purchaseHistory()?.length === 0,
  );

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.purchaseHistory());
    this.dataSource = new MatTableDataSource<StockPurchaseHistory>(
      this.purchaseHistory() ?? [],
    );
  }
}
