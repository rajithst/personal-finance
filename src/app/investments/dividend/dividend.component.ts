import { Component, inject, OnInit } from '@angular/core';
import { DividendTableComponent } from './dividend-table/dividend-table.component';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/api.service';
import { AsyncPipe } from '@angular/common';
import { MonthlyDividend } from '../model/dividend';

@Component({
    selector: 'app-dividend',
    template: `<app-dividend-table
    [dividends]="dividends$ | async"
  ></app-dividend-table>`,
    styles: ``,
    imports: [DividendTableComponent, AsyncPipe]
})
export class DividendComponent implements OnInit {
  private readonly apiService = inject(ApiService);
  dividends$: Observable<MonthlyDividend[]>;

  ngOnInit(): void {
    this.dividends$ = this.apiService.getDividends();
  }
}
