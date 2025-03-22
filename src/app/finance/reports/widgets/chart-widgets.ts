import { Component, inject, OnInit, signal } from '@angular/core';
import { ChartWidgetBase } from '../../../components/widget/chart-widget-base';
import { AnalyticsService } from '../analytics.service';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-total-summary',
  template: `
    <div class="summary-item">
      <div class="label">Total Amount</div>
      <div class="value">{{ totalAmount() }}</div>
    </div>
    <div class="summary-item">
      <div class="label">Date Range</div>
      <div class="value">{{ dateRange() }}</div>
    </div>
  `,
  styles: `
    .summary-item {
      display: flex;
      justify-content: start;
      align-items: center;
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      padding: 12px 20px;
      margin: 15px;
      transition:
        transform 0.3s ease,
        box-shadow 0.3s ease;
      .label {
        margin-right: 20px;
      }
    }
  `,
  imports: [],
  providers: [],
})
export class TotalSummaryWidget implements OnInit {
  private readonly analyticsService = inject(AnalyticsService);
  totalAmount = signal<string | null>(null);
  dateRange = signal<string | null>(null);

  ngOnInit() {
    const formattedValue = (value: number) => Math.abs(value).toFixed(2);
    const data = this.analyticsService.analyticsData();
    const total = data?.reduce((ac, cv) => ac + cv.total, 0) ?? 0;
    this.totalAmount.set(`¥${formattedValue(total)}`);
    this.dateRange.set(this.analyticsService.dateRange());
  }
}

@Component({
  selector: 'app-analytics-summary',
  template: `
    <app-chart-widget
      [chartType]="'doughnut'"
      [labels]="labels"
      [datasets]="datasets"
      [plugins]="plugins"
    ></app-chart-widget>
  `,
  imports: [ChartWidgetBase],
  providers: [],
})
export class AnalyticsChartWidget implements OnInit {
  private readonly analyticsService = inject(AnalyticsService);

  datasets: any[] = [];
  labels: string[] = [];
  plugins = {
    legend: {
      display: true,
      position: 'right',
      align: 'left',
    },
  };

  ngOnInit() {
    const data = this.analyticsService.analyticsData() ?? [];
    const showSubcategories = this.analyticsService.showSubcategories();
    if (showSubcategories) {
      const chartData = data[0].subcategories;
      this.labels = chartData.map((x) => x.subcategory) || [];
      this.datasets = [
        {
          label: '¥',
          data: chartData.map((x: any) => x.total) || [],
          backgroundColor: chartData.map((x: any) => x.color) || [],
        },
      ];
    } else {
      this.labels = data.map((x) => x.category) || [];
      this.datasets = [
        {
          label: '¥',
          data: data.map((x: any) => x.total) || [],
          backgroundColor: data.map((x: any) => x.color) || [],
        },
      ];
    }
  }
}

@Component({
  selector: 'app-analytics-category',
  template: `
    <div class="detail-list">
      @for (data of breakDown(); track data) {
        <ul>
          <li>
            <div class="list-content">
              <div
                [style.background-color]="data.color"
                class="list-icon"
              ></div>
              <div class="list-text">
                <div class="text-content">
                  <div class="name">
                    {{ data.category }}
                  </div>
                  <div class="amount">¥{{ data.total | number: '1.2-2' }}</div>
                </div>
              </div>
            </div>
          </li>
        </ul>
      }
    </div>
  `,
  styles: `
    ul {
      list-style: none;
    }
    .text-content {
      display: flex;
      flex-direction: column;
    }
    .list-icon {
      width: 10px;
      height: 10px;
      margin-right: 10px;
    }
    .list-content {
      display: flex;
      flex-direction: row;
      align-items: center;
    }
    .amount {
      color: gray;
      font-size: 12px;
    }
    .detail-list {
      display: flex;
      flex-wrap: wrap;
    }
  `,
  imports: [DecimalPipe],
  providers: [],
})
export class AnalyticsCategoryWidget implements OnInit {
  readonly analyticsService = inject(AnalyticsService);
  breakDown = signal<
    { category: string; color?: string; total: number }[] | null
  >(null);

  ngOnInit() {
    const data = this.analyticsService.analyticsData() ?? [];
    const showSubcategories = this.analyticsService.showSubcategories();
    if (showSubcategories) {
      const breakDownData = data[0].subcategories.map(x => ({category: x.subcategory, color: x.color, total: x.total}))
      this.breakDown.set(breakDownData);
    } else {
      const breakdownData = data.map(x => ({category: x.category, color: x.color, total: x.total}))
      this.breakDown.set(breakdownData);
    }
  }
}
