import { Component, inject, OnDestroy } from '@angular/core';
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
  SectorAllocationWidget,
} from './widgets/chart-widgets';
import { PortfolioService } from './portfolio.service';

@Component({
  selector: 'app-portfolio',
  template: `
    <div class="dashboard-widgets">
      @for (widget of widgets; track widget) {
        <app-widget [data]="widget"></app-widget>
      }
    </div>
  `,
  styles: `
    .dashboard-widgets {
      height: 99%;
      overflow-y: auto;
      display: grid;
      grid-template-columns: repeat(4, minmax(200px, 1fr));
      grid-auto-rows: 120px;
      gap: 10px;
    }
  `,
  imports: [WidgetComponent],
  providers: [PortfolioService],
})
export class PortfolioComponent implements OnDestroy {
  protected readonly destroyed$ = new ReplaySubject<void>(1);
  private readonly portfolioService = inject(PortfolioService);
  widgets: Widget[] = [];

  constructor() {
    const apiService = inject(ApiService);
    const performance$ = apiService.getPortfolioPerformance();

    performance$.pipe(takeUntil(this.destroyed$)).subscribe((performance) => {
      this.portfolioService.setPortfolioData(performance);
      this.prepareWidgets();
    });
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
      {
        id: 1,
        label: 'Monthly Investment',
        content: MonthlyInvestmentWidget,
        rows: 3,
        columns: 2,
        hideSettingsButton: true,
      },
    ];
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
