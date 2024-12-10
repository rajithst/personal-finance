import { Component, computed, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import {
  MatTable,
  MatColumnDef,
  MatHeaderCellDef,
  MatHeaderCell,
  MatCellDef,
  MatCell,
  MatRowDef,
  MatRow,
} from '@angular/material/table';
import {
  MatCard,
  MatCardHeader,
  MatCardTitle,
  MatCardContent,
} from '@angular/material/card';
import { DividendIncome } from '../../model/stock';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

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
    MatRowDef,
    MatRow,
    DecimalPipe,
    MatProgressSpinner,
  ],
})
export class DividendTableComponent {
  dividends = input.required<DividendIncome[] | null>();
  loading = computed(() => this.dividends() === null);
  noData = computed(() => !this.loading() && this.dividends()?.length === 0);
  displayedColumns: string[] = [
    'position',
    'name',
    'weight',
    'symbol',
    'action',
  ];

  dividendPaymentFlow(element: any) {}
}
