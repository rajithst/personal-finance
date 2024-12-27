import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { DashboardResponse } from '../model/dashboard';
import { ReplaySubject } from 'rxjs';
import { ApiService } from '../../core/api.service';
import {
  Widget,
  WidgetComponent,
} from '../../components/widget/widget.component';
import { DashboardService } from './dashboard.service';
import {
  CashFlowWidget,
  IncomeVsPaymentsWidget,
  IncomeVsSavingsWidget,
  MonthlyAccountUsageWidget,
  MonthlyExpenseCategoryWidget,
  MonthlyPaymentCategoryWidget,
  TopExpensesWidget,
} from './widgets/chart-widgets';
import {
  TotalExpenseWidget,
  TotalIncomeWidget,
  TotalPaymentsWidget,
  TotalSavingsWidget,
} from './widgets/summary-widgets';
import { ChartUtilityService } from './chart-utils.service';

@Component({
  selector: 'app-transaction-portfolio',
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
      gap: 5px;
    }
  `,
  imports: [WidgetComponent],
  providers: [DashboardService, ChartUtilityService],
})
export class TransactionDashboardComponent implements OnInit, OnDestroy {
  private readonly apiService = inject(ApiService);
  protected readonly destroyed$ = new ReplaySubject<void>(1);
  readonly dashboardService = inject(DashboardService);
  readonly chartUtilityService = inject(ChartUtilityService);
  readonly currentYear = this.chartUtilityService.getCurrentYear();

  dashboardData: DashboardResponse;
  widgets: Widget[] = [];

  ngOnInit() {
    this.apiService.getDashboard(Number(this.currentYear)).then((dashboardData) => {
      this.dashboardService.setDashboardData(dashboardData);
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
        label: `Cashflow Breakdown (${this.chartUtilityService.getCurrentYear()})`,
        content: CashFlowWidget,
        rows: 3,
        columns: 2,
      },
      {
        id: 1,
        label: `Income vs Payments (${this.chartUtilityService.getCurrentYear()})`,
        content: IncomeVsPaymentsWidget,
        rows: 3,
        columns: 2,
      },
      {
        id: 1,
        label: `Income vs Savings (${this.chartUtilityService.getCurrentYear()})`,
        content: IncomeVsSavingsWidget,
        rows: 3,
        columns: 2,
      },
      {
        id: 1,
        label: `Spending Breakdown (${this.chartUtilityService.getCurrentMonth()})`,
        content: MonthlyExpenseCategoryWidget,
        rows: 3,
        columns: 1,
      },
      {
        id: 1,
        label: `Payment Breakdown (${this.chartUtilityService.getCurrentMonth()})`,
        content: MonthlyPaymentCategoryWidget,
        rows: 3,
        columns: 1,
      },
      {
        id: 1,
        label: `Top Expenses (${this.chartUtilityService.getCurrentMonth()})`,
        content: TopExpensesWidget,
        rows: 3,
        columns: 2,
      },
      {
        id: 1,
        label: `Account usage (${this.chartUtilityService.getCurrentMonth()})`,
        content: MonthlyAccountUsageWidget,
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
