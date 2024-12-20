import { Component, inject, OnInit } from '@angular/core';
import { ChartWidgetBase } from '../../../components/widget/chart-widget-base';
import { ChartUtilityService } from '../chart-utils.service';
import { PortfolioService } from '../portfolio.service';

@Component({
  selector: 'app-monthly-investments',
  template: `
    <app-chart-widget
      [chartType]="'doughnut'"
      [labels]="labels"
      [datasets]="datasets"
    ></app-chart-widget>
  `,
  imports: [ChartWidgetBase],
  providers: [ChartUtilityService],
})
export class PortfolioAllocationWidget {
  datasets: any[] = [];
  labels: string[] = [];
}

@Component({
  selector: 'app-industry-allocation',
  imports: [ChartWidgetBase],
  template: `
    <app-chart-widget
      [chartType]="'doughnut'"
      [labels]="labels"
      [datasets]="datasets"
      [plugins]="plugins"
    ></app-chart-widget>
  `,
  styles: ``,
})
export class IndustryAllocationWidget implements OnInit {
  private readonly portfolioService = inject(PortfolioService);

  labels: string[] = [];
  datasets: any[] = [];
  plugins: any = {
    legend: {
      display: false,
    },
  };
  ngOnInit() {
    const data =
      this.portfolioService.portfolioData()?.industry_allocation ?? [];
    this.labels = Object.keys(data);
    this.datasets = [
      {
        label: 'Industry Allocation',
        data: Object.values(data) || [],
      },
    ];
  }
}

@Component({
  selector: 'app-sector-allocation',
  imports: [ChartWidgetBase],
  template: `
    <app-chart-widget
      [chartType]="'doughnut'"
      [labels]="labels"
      [datasets]="datasets"
      [plugins]="plugins"
    ></app-chart-widget>
  `,
  styles: ``,
})
export class SectorAllocationWidget implements OnInit {
  private readonly portfolioService = inject(PortfolioService);

  labels: string[] = [];
  datasets: any[] = [];
  plugins: any = {
    legend: {
      display: false,
    },
  };
  ngOnInit() {
    const data = this.portfolioService.portfolioData()?.sector_allocation ?? [];
    this.labels = Object.keys(data);
    this.datasets = [
      { label: 'Industry Allocation', data: Object.values(data) || [] },
    ];
  }
}

@Component({
  selector: 'app-monthly-investment',
  imports: [ChartWidgetBase],
  template: `
    <app-chart-widget
      [chartType]="'bar'"
      [labels]="labels"
      [datasets]="datasets"
    ></app-chart-widget>
  `,
  styles: ``,
})
export class MonthlyInvestmentWidget implements OnInit {
  private readonly portfolioService = inject(PortfolioService);

  labels: string[] = [];
  datasets: any[] = [];

  ngOnInit() {
    const data =
      this.portfolioService.portfolioData()?.monthly_investment ?? [];
    this.labels = Object.keys(data);
    this.datasets = [
      { label: 'Monthly Investment', data: Object.values(data) || [] },
    ];
  }
}
