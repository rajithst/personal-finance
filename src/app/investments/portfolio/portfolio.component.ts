import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from '../../core/api.service';
import { ReplaySubject, takeUntil } from 'rxjs';
import {
  Widget,
  WidgetComponent,
} from '../../components/widget/widget.component';
import {
  PortfolioGainsWidget,
  PortfolioValueWidget,
} from './widgets/summary-widgets';
import {
  IndustryAllocationWidget,
  MonthlyInvestmentWidget,
  PortfolioAllocationWidget,
  PortfolioGrowthWidget,
  SectorAllocationWidget, SectorPerformanceWidget,
} from './widgets/chart-widgets';
import { PortfolioService } from './portfolio.service';
import { InvestmentStore } from '../../core/store/investment.store';
import { LoadingComponent } from '../../components/loading/loading.component';
import { DataService } from '../../service/data.service';

@Component({
  selector: 'app-portfolio',
  template: `
    @if (portfolioService.loading()) {
      <app-loading></app-loading>
    } @else {
      <div class="dashboard-widgets">
        @for (widget of widgets; track widget) {
          <app-widget [data]="widget"></app-widget>
        }
      </div>
    }
  `,
  styles: `
    .dashboard-widgets {
      height: 95%;
      overflow-y: auto;
      display: grid;
      grid-template-columns: repeat(4, minmax(150px, 0.5fr));
      grid-auto-rows: 120px;
      gap: 10px;
    }
  `,
  imports: [WidgetComponent, LoadingComponent],
  providers: [PortfolioService],
})
export class PortfolioComponent implements OnInit, OnDestroy {
  protected readonly destroyed$ = new ReplaySubject<void>(1);
  private readonly dataService = inject(DataService);
  private readonly apiService = inject(ApiService);
  private readonly store = inject(InvestmentStore);
  readonly portfolioService = inject(PortfolioService);
  widgets: Widget[] = [];

  ngOnInit() {
    this.dataService.portfolioSwitcher
      .pipe(takeUntil(this.destroyed$))
      .subscribe((portfolioId) => {
        if (!portfolioId) {
          return;
        }
        this.getPortfolioData().then();
      });
  }

  async getPortfolioData() {
    this.portfolioService.setLoading(true);
    const portfolio = await this.apiService.getPortfolioPerformance(
      this.store.currentPortfolio()?.id ?? 0,
    );
    this.portfolioService.setPortfolioData(portfolio);
    this.prepareWidgets();
    this.portfolioService.setLoading(false);
  }

  prepareWidgets() {
    this.widgets = [
      {
        id: 1,
        label: 'Portfolio Value',
        content: PortfolioValueWidget,
        rows: 1,
        columns: 1,
        backgroundColor: '#003f5c',
        color: 'whitesmoke',
        hideSettingsButton: true,
      },
      {
        id: 1,
        label: 'Portfolio Gains',
        content: PortfolioGainsWidget,
        rows: 1,
        columns: 1,
        backgroundColor: '#003f5c',
        color: 'whitesmoke',
        hideSettingsButton: true,
      },
      {
        id: 1,
        label: 'IRR',
        content: PortfolioGainsWidget,
        rows: 1,
        columns: 1,
        backgroundColor: '#003f5c',
        color: 'whitesmoke',
        hideSettingsButton: true,
      },
      {
        id: 1,
        label: 'Passive Income',
        content: PortfolioGainsWidget,
        rows: 1,
        columns: 1,
        backgroundColor: '#003f5c',
        color: 'whitesmoke',
        hideSettingsButton: true,
      },
      {
        id: 1,
        label: 'Portfolio Growth',
        content: PortfolioGrowthWidget,
        rows: 3,
        columns: 2,
        hideSettingsButton: true,
      },
      {
        id: 1,
        label: 'Monthly Investment',
        content: MonthlyInvestmentWidget,
        rows: 3,
        columns: 2,
        hideSettingsButton: true,
      },
      {
        id: 1,
        label: 'Portfolio Allocation',
        content: PortfolioAllocationWidget,
        rows: 3,
        columns: 2,
        hideSettingsButton: true,
      },
      {
        id: 1,
        label: '',
        content: SectorPerformanceWidget,
        rows: 3,
        columns: 2,
        hideSettingsButton: true,
      },
      {
        id: 1,
        label: 'Industry Allocation',
        content: IndustryAllocationWidget,
        rows: 3,
        columns: 1,
        hideSettingsButton: true,
      },
      {
        id: 1,
        label: 'Sector Allocation',
        content: SectorAllocationWidget,
        rows: 3,
        columns: 1,
        hideSettingsButton: true,
      },
    ];
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
