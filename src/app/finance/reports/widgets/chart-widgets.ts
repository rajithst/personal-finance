import { Component, inject, OnInit } from '@angular/core';
import { ChartWidgetBase } from '../../../components/widget/chart-widget-base';
import { AnalyticsService } from '../analytics.service';
import { MatList } from '@angular/material/list';
import { DecimalPipe } from '@angular/common';

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
      display: false,
      position: 'right',
      align: 'left',
    },
  };

  ngOnInit() {
    const data = this.analyticsService.analyticsData() ?? [];
    this.labels = data.map((x: any) => x.category) || [];
    this.datasets = [
      {
        label: 'Expenses',
        data: data.map((x: any) => x.amount) || [],
        backgroundColor: data.map((x: any) => x.color) || [],
      },
    ];
  }
}

@Component({
  selector: 'app-analytics-category',
  template: `
    <mat-list role="list">
      @for (data of analyticsService.analyticsData(); track data) {
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
                  <div class="amount">¥{{ data.amount | number: '1.2-2' }}</div>
                </div>
              </div>
            </div>
          </li>
        </ul>
      }
    </mat-list>
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
      border-radius: 10px;
      margin-right: 10px;
    }
    .list-content {
      display: flex;
      flex-direction: row;
      align-items: center;
    }
  `,
  imports: [MatList, DecimalPipe],
  providers: [],
})
export class AnalyticsCategoryWidget {
  readonly analyticsService = inject(AnalyticsService);
}
