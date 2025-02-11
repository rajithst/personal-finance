import {Component, inject, OnDestroy, OnInit, signal} from '@angular/core';
import { DividendTableComponent } from './dividend-table/dividend-table.component';
import { Observable, of, ReplaySubject, takeUntil } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { MonthlyDividend } from '../model/dividend';
import { DataService } from '../../service/data.service';
import {
  Widget,
  WidgetComponent,
} from '../../components/widget/widget.component';
import {
  DividendHistoryWidget,
  DividendSummaryWidget,
} from './widgets/dividend-history-widget';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatMiniFabButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { InvestmentStore } from '../../core/store/investment.store';
import {MatProgressSpinner} from "@angular/material/progress-spinner";

@Component({
  selector: 'app-dividend',
  templateUrl: './dividend.component.html',
  styleUrl: './dividend.component.scss',
  imports: [
    WidgetComponent,
    AsyncPipe,
    DividendTableComponent,
    MatIcon,
    MatMiniFabButton,
    MatTooltip,
    MatButton,
    RouterLink,
    MatProgressSpinner,
  ],
})
export class DividendComponent implements OnInit, OnDestroy {
  private readonly destroyed$ = new ReplaySubject<void>(1);
  private readonly dataService = inject(DataService);
  private readonly store = inject(InvestmentStore);
  loading = signal(false);

  dividends$: Observable<MonthlyDividend[] | null>;
  widgets: Widget[] = [];

  ngOnInit(): void {
    this.getDividends().then();

    this.dataService.portfolioSwitcher
      .pipe(takeUntil(this.destroyed$))
      .subscribe((portfolioId) => {
        if (!portfolioId) {
          return;
        }
        this.getDividends().then();
      });
  }

  async getDividends() {
    this.loading.set(true);
    await this.store.getDividends(this.store.currentPortfolio()?.id ?? 0);
    this.dividends$ = of(this.store.dividends().slice(-1) ?? []);
    this.prepareWidgets();
    this.loading.set(false);
  }

  prepareWidgets() {
    this.widgets = [
      {
        id: 1,
        label: 'Dividend Summary',
        content: DividendSummaryWidget,
        rows: 2,
        columns: 1,
        hideSettingsButton: true,
      },
      {
        id: 1,
        label: 'Dividend History',
        content: DividendHistoryWidget,
        rows: 2,
        columns: 3,
        hideSettingsButton: true,
      },
    ];
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
