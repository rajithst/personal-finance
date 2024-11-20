import { Component, Input } from '@angular/core';
import {
  faCaretDown,
  faCaretUp,
  faCircleCheck,
  faJpy,
  faLineChart,
  faMoneyBill,
} from '@fortawesome/free-solid-svg-icons';
import { DecimalPipe } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatRowDef, MatRow } from '@angular/material/table';
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent } from '@angular/material/card';

@Component({
    selector: 'app-dividend-table',
    templateUrl: './dividend-table.component.html',
    styleUrl: './dividend-table.component.scss',
    standalone: true,
    imports: [
        MatCard,
        MatCardHeader,
        MatCardTitle,
        MatCardContent,
        MatTable,
        MatColumnDef,
        MatHeaderCellDef,
        MatHeaderCell,
        MatCellDef,
        MatCell,
        FaIconComponent,
        MatRowDef,
        MatRow,
        DecimalPipe,
    ],
})
export class DividendTableComponent {
  @Input() dividends: any[] = [];

  displayedColumns: string[] = [
    'position',
    'name',
    'weight',
    'symbol',
    'action',
  ];
  protected readonly faCaretUp = faCaretUp;
  protected readonly faMoneyBill = faMoneyBill;
  protected readonly faLineChart = faLineChart;
  protected readonly faJpy = faJpy;
  protected readonly faCaretDown = faCaretDown;
  protected readonly Math = Math;
  protected readonly faCircleCheck = faCircleCheck;

  dividendPaymentFlow(element: any) {}
}
