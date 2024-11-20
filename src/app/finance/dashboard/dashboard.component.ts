import { Component, inject, OnDestroy } from '@angular/core';
import {
  DashboardResponse,
} from '../model/dashboard';
import { DataService } from '../../service/data.service';
import { forkJoin, ReplaySubject, takeUntil } from 'rxjs';
import { ApiService } from '../../core/api.service';
import {
  Widget,
  WidgetComponent,
} from '../../components/widget/widget.component';
import { DashboardService } from './dashboard.service';
import {
  IncomeVsPaymentsWidget,
  IncomeVsSavingsWidget,
  MonthlyAccountUsageWidget,
  MonthlyExpenseCategoryWidget,
  MonthlyPaymentCategoryWidget,
} from './widgets/chart-widgets';
import {
  TotalExpenseWidget,
  TotalIncomeWidget,
  TotalPaymentsWidget,
  TotalSavingsWidget,
} from './widgets/summary-widgets';

@Component({
  selector: 'app-transaction-dashboard',
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
  standalone: true,
  imports: [
    WidgetComponent,
  ],
  providers: [DashboardService],
})
export class TransactionDashboardComponent implements OnDestroy {
  private readonly dataService = inject(DataService);
  private readonly apiService = inject(ApiService);
  protected readonly destroyed$ = new ReplaySubject<void>(1);
  readonly widgetStore = inject(DashboardService);

  dashboardData: DashboardResponse;
  widgets: Widget[] = [];
  constructor() {
    const settings$ = this.apiService.initSettings();
    const dashboard$ = this.apiService.getDashboard();

    forkJoin({ settings: settings$, dashboard: dashboard$ })
      .pipe(takeUntil(this.destroyed$))
      .subscribe(({ settings, dashboard }) => {
        this.dataService.setClientSettings(settings);
        this.widgetStore.setDashboardData(dashboard);
        this.prepareWidgets();
      });
  }

  prepareWidgets() {
    this.widgets = [
      {
        id: 1,
        label: 'Total Income',
        content: TotalIncomeWidget,
        rows: 1,
        columns: 1,
        backgroundColor: '#003f5c',
        color: 'whitesmoke',
        hideSettingsButton: true,
      },
      {
        id: 1,
        label: 'Total Expense',
        content: TotalExpenseWidget,
        rows: 1,
        columns: 1,
        backgroundColor: '#003f5c',
        color: 'whitesmoke',
        hideSettingsButton: true,
      },
      {
        id: 1,
        label: 'Total Payments',
        content: TotalPaymentsWidget,
        rows: 1,
        columns: 1,
        backgroundColor: '#003f5c',
        color: 'whitesmoke',
        hideSettingsButton: true,
      },
      {
        id: 1,
        label: 'Total Savings',
        content: TotalSavingsWidget,
        rows: 1,
        columns: 1,
        backgroundColor: '#003f5c',
        color: 'whitesmoke',
        hideSettingsButton: true,
      },
      {
        id: 1,
        label: 'Income vs Payments',
        content: IncomeVsPaymentsWidget,
        rows: 3,
        columns: 2,
      },
      {
        id: 1,
        label: 'Income vs Savings',
        content: IncomeVsSavingsWidget,
        rows: 3,
        columns: 2,
      },
      {
        id: 1,
        label: 'Spending Breakdown',
        content: MonthlyExpenseCategoryWidget,
        rows: 3,
        columns: 1,
      },
      {
        id: 1,
        label: 'Payment Breakdown',
        content: MonthlyPaymentCategoryWidget,
        rows: 3,
        columns: 1,
      },
      {
        id: 1,
        label: 'Account usage breakdown',
        content: MonthlyAccountUsageWidget,
        rows: 3,
        columns: 1,
      },
      {
        id: 1,
        label: 'Monthly Expense',
        content: MonthlyExpenseCategoryWidget,
        rows: 3,
        columns: 1,
      },
    ];
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
