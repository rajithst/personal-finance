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

@Component({
  selector: 'app-trade-history-table',
  templateUrl: './trade-history-table.component.html',
  styleUrl: './trade-history-table.component.css',
})
export class TradeHistoryTableComponent implements OnChanges {
  @Input() trades: any[] = [];

  protected readonly faCircleCheck = faCircleCheck;
  protected readonly faCaretUp = faCaretUp;
  protected readonly faCaretDown = faCaretDown;
  protected readonly faEllipsis = faEllipsis;

  displayedColumns: string[] = ['Stock', 'Date', 'Shares', 'Price', 'CurrentShareValue', 'TotalProfit', 'Actions'];

  dataSource = new MatTableDataSource();

  ngOnChanges(changes: SimpleChanges): void {
    this.dataSource = new MatTableDataSource(this.trades);
  }

  protected readonly faPlus = faPlus;
  protected readonly faTrash = faTrash;
  protected readonly faEdit = faEdit;
}
