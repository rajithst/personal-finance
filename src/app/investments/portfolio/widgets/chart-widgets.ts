import { Component, inject, OnInit } from '@angular/core';
import { ChartWidgetBase } from '../../../components/widget/chart-widget-base';
import { ChartUtilityService } from '../chart-utils.service';
import { PortfolioService } from '../portfolio.service';
import { DecimalPipe } from '@angular/common';
import { SectorPerformance } from '../../model/portfolio';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
} from '@angular/material/table';
import {InvestmentStore} from "../../../core/store/investment.store";

@Component({
  selector: 'app-monthly-investments',
  template: `
    <app-chart-widget
      [chartType]="'doughnut'"
      [labels]="labels"
      [datasets]="datasets"
      [plugins]="plugins"
    ></app-chart-widget>
  `,
  imports: [ChartWidgetBase],
  providers: [ChartUtilityService],
})
export class PortfolioAllocationWidget implements OnInit {
  private readonly portfolioService = inject(PortfolioService);

  datasets: any[] = [];
  labels: string[] = [];
  plugins = {
    legend: {
      display: true,
      position: 'right',
      align: 'center',
    },
  };

  ngOnInit() {
    const data = this.portfolioService.portfolioData()?.sector_allocation ?? [];
    this.labels = Object.keys(data);
    this.datasets = [
      {
        data: Object.values(data) || [],
      },
    ];
  }
}

@Component({
  selector: 'app-industry-allocation',
  imports: [ChartWidgetBase],
  template: `
    <app-chart-widget
      [chartType]="'bar'"
      [labels]="labels"
      [datasets]="datasets"
      [options]="options"
    ></app-chart-widget>
  `,
  styles: ``,
})
export class IndustryAllocationWidget implements OnInit {
  private readonly portfolioService = inject(PortfolioService);

  labels: string[] = [];
  datasets: any[] = [];
  options = {
    indexAxis: 'y',
    scales: {
      y: {
        ticks: {
          autoSkip: false,
        },
      },
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
      [chartType]="'bar'"
      [labels]="labels"
      [datasets]="datasets"
      [options]="options"
    ></app-chart-widget>
  `,
  styles: ``,
})
export class SectorAllocationWidget implements OnInit {
  private readonly portfolioService = inject(PortfolioService);

  labels: string[] = [];
  datasets: any[] = [];
  options = {
    indexAxis: 'y',
    scales: {
      y: {
        ticks: {
          autoSkip: false,
        },
      },
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

@Component({
  selector: 'app-monthly-investment',
  imports: [ChartWidgetBase],
  template: `
    <app-chart-widget
      [chartType]="'line'"
      [labels]="labels"
      [datasets]="datasets"
      [options]="options"
    ></app-chart-widget>
  `,
  styles: ``,
})
export class PortfolioGrowthWidget implements OnInit {
  private readonly portfolioService = inject(PortfolioService);

  labels: string[] = [];
  datasets: any[] = [];
  options: any = {
    borderWidth: 3,
  };

  ngOnInit() {
    const data = this.portfolioService.portfolioData()?.growth ?? [];
    const invested = data.map((x) => x['total_investment']);
    const current = data.map((x) => x['portfolio_value']);
    this.labels = data.map((x) => x.date);
    this.datasets = [
      { label: 'Invested', data: invested || [] },
      { label: 'Current Value', data: current || [] },
    ];
  }
}

@Component({
  selector: 'app-sector-performance',
  providers: [],
  imports: [
    MatTable,
    MatHeaderCell,
    MatColumnDef,
    MatCell,
    MatHeaderRow,
    MatRow,
    MatHeaderRowDef,
    MatHeaderCellDef,
    MatCellDef,
    MatRowDef,
    DecimalPipe,
  ],
  template: `
    <table mat-table [dataSource]="dataSource" class="mat-elevation-z3">
      <ng-container matColumnDef="Sector">
        <th mat-header-cell *matHeaderCellDef>Sector</th>
        <td mat-cell *matCellDef="let element">{{ element.sector }}</td>
      </ng-container>
      <ng-container matColumnDef="Invested">
        <th mat-header-cell *matHeaderCellDef>Invested</th>
        <td mat-cell *matCellDef="let element">
          {{currency}}{{ element.total_investment }}
        </td>
      </ng-container>
      <ng-container matColumnDef="CurrentValue">
        <th mat-header-cell *matHeaderCellDef>Current Value</th>
        <td mat-cell *matCellDef="let element">
          {{currency}}{{ element.total_current_value }}
        </td>
      </ng-container>
      <ng-container matColumnDef="Gain">
        <th mat-header-cell *matHeaderCellDef>Gain</th>
        <td mat-cell *matCellDef="let element">
          <span
            [class.profit]="element.total_profit_loss > 0"
            [class.loss]="element.total_profit_loss < 0"
          >
            {{ element.total_profit_loss > 0 ? '+' : '-'
            }}{{currency}}{{ Math.abs(element.total_profit_loss) }}</span
          >
        </td>
      </ng-container>
      <ng-container matColumnDef="Allocation">
        <th mat-header-cell *matHeaderCellDef>Allocation</th>
        <td mat-cell *matCellDef="let element">
          {{
            (element.total_investment / totalInvested) * 100 | number: '1.2-2'
          }}%
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
    </table>`,
  styleUrl: './chart-widget.scss',
})
export class SectorPerformanceWidget implements OnInit {
  private readonly portfolioService = inject(PortfolioService);
  private readonly store = inject(InvestmentStore);
  protected readonly Math = Math;
  dataSource: SectorPerformance[] = [];
  displayedColumns: string[] = [
    'Sector',
    'Invested',
    'CurrentValue',
    'Gain',
    'Allocation',
  ];
  totalInvested: number = 0;
  currency = '';
  ngOnInit() {
    const portfolio = this.portfolioService.portfolioData();
    this.totalInvested = portfolio?.total_investment ?? 0;
    this.dataSource = portfolio?.sector_performance ?? [];
    const currency =  this.store.currentPortfolio()?.currency;
    if (currency === 'USD') {
      this.currency = '$';
    } else if (currency === 'JPY') {
      this.currency = '¥';
    }
  }
}
