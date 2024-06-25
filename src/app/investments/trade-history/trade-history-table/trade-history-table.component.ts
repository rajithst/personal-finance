import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {
  faCircleCheck,
  faCaretUp,
  faCaretDown,
  faEllipsis,
  faPlus,
  faTrash,
  faEdit
} from '@fortawesome/free-solid-svg-icons';
import {MatTableDataSource} from "@angular/material/table";
import {StockPurchaseHistory} from "../../model/investment";

@Component({
  selector: 'app-trade-history-table',
  templateUrl: './trade-history-table.component.html',
  styleUrl: './trade-history-table.component.css',
})
export class TradeHistoryTableComponent implements OnChanges {
  @Input() trades: StockPurchaseHistory[] = [];

  protected readonly faCircleCheck = faCircleCheck;
  protected readonly faCaretUp = faCaretUp;
  protected readonly faCaretDown = faCaretDown;
  protected readonly faEllipsis = faEllipsis;

  displayedColumns: string[] = ['Stock', 'Date', 'Shares', 'Industry', 'Sector', 'Price', 'CurrentShareValue', 'TotalProfit', 'Actions'];

  dataSource = new MatTableDataSource<StockPurchaseHistory>();

  ngOnChanges(changes: SimpleChanges): void {
    this.dataSource = new MatTableDataSource<StockPurchaseHistory>(this.trades);
  }

  protected readonly faPlus = faPlus;
  protected readonly faTrash = faTrash;
  protected readonly faEdit = faEdit;
}
