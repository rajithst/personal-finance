import {Component, inject, OnInit} from '@angular/core';
import {AsyncPipe} from "@angular/common";
import {DividendTableComponent} from "../dividend-table/dividend-table.component";
import {Observable, of} from "rxjs";
import {MonthlyDividend} from "../../model/dividend";
import {InvestmentStore} from "../../../core/store/investment.store";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-dividend-flow',
  templateUrl: './dividend-flow.component.html',
  styleUrl: './dividend-flow.component.scss',
  standalone: true,
  imports: [
    AsyncPipe,
    DividendTableComponent,
    RouterLink,
  ],
})
export class DividendFlowComponent implements OnInit {
  private readonly store = inject(InvestmentStore);
  dividends$: Observable<MonthlyDividend[] | null>;

  ngOnInit() {
    const data = this.store.dividends();
    console.log(data);
    if (!data || data.length === 0) {
      this.getDividends(this.store.currentPortfolio()?.id ?? 0).then(() =>
        this.prepareTable(),
      );
    } else {
      this.prepareTable();
    }
  }

  async getDividends(portfolioId: number) {
    await this.store.getDividends(portfolioId);
    return true;
  }

  prepareTable() {
    this.dividends$ = of([...this.store.dividends()].reverse());
  }
}
