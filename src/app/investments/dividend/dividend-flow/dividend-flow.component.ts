import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {AsyncPipe} from "@angular/common";
import {DividendTableComponent} from "../dividend-table/dividend-table.component";
import {Observable, of, ReplaySubject, takeUntil} from "rxjs";
import {MonthlyDividend} from "../../model/dividend";
import {InvestmentStore} from "../../../core/store/investment.store";
import {RouterLink} from "@angular/router";
import {DataService} from "../../../service/data.service";

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
export class DividendFlowComponent implements OnInit, OnDestroy {
  private readonly store = inject(InvestmentStore);
  private readonly dataService = inject(DataService);
  private readonly destroyed$ = new ReplaySubject<void>(1);
  dividends$: Observable<MonthlyDividend[] | null>;


  ngOnInit() {
    this.dataService.portfolioSwitcher
      .pipe(takeUntil(this.destroyed$))
      .subscribe((portfolioId) => {
        if (!portfolioId) {
          return;
        }
        this.getDividends(portfolioId).then(() => this.prepareTable());
      });

    const data = this.store.dividends();
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

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
