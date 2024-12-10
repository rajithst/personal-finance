import {Component, inject, OnInit} from '@angular/core';
import { DividendTableComponent } from './dividend-table/dividend-table.component';
import { MatTabGroup, MatTab } from '@angular/material/tabs';
import {Observable} from "rxjs";
import {ApiService} from "../../core/api.service";
import {AsyncPipe} from "@angular/common";
import {Dividend, DividendIncome} from "../model/stock";

@Component({
  selector: 'app-dividend',
  template: `<app-dividend-table
    [dividends]="dividends$ | async"
  ></app-dividend-table>`,
  styles: ``,
  standalone: true,
  imports: [DividendTableComponent, AsyncPipe],
})
export class DividendComponent implements OnInit {
  private readonly apiService = inject(ApiService);
  dividends$: Observable<DividendIncome[]>;

  ngOnInit(): void {
    this.dividends$ = this.apiService.getDividends();
  }
}
