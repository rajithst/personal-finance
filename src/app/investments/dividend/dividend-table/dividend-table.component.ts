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
import {MonthlyDividend} from "../../model/dividend";
import {LoadingComponent} from "../../../components/loading/loading.component";
import {NorecordsComponent} from "../../../components/norecords/norecords.component";
import {MatChip, MatChipSet} from "@angular/material/chips";

@Component({
  selector: 'app-dividend-table',
  templateUrl: './dividend-table.component.html',
  styleUrl: './dividend-table.component.scss',
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
    LoadingComponent,
    NorecordsComponent,
    MatChipSet,
    MatChip,
  ],
})
export class DividendTableComponent {
  dividends = input.required<MonthlyDividend[] | null>();
  loading = computed(() => this.dividends() === null);
  noData = computed(() => !this.loading() && this.dividends()?.length === 0);
  displayedColumns: string[] = [
    'position',
    'name',
    'weight',
    'symbol',
    'action',
  ];
}
