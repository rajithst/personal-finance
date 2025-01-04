import { Component, inject, OnInit } from '@angular/core';
import { ChartWidgetBase } from '../../../components/widget/chart-widget-base';
import { AsyncPipe } from '@angular/common';
import { DividendTableComponent } from '../dividend-table/dividend-table.component';
import { Observable, of } from 'rxjs';
import { MonthlyDividend } from '../../model/dividend';
import { InvestmentStore } from '../../../core/store/investment.store';

@Component({
  selector: 'app-dividend-history',
  imports: [ChartWidgetBase],
  template: `
    <app-chart-widget
      [chartType]="'bar'"
      [labels]="labels"
      [datasets]="datasets"
      [plugins]="plugins"
    ></app-chart-widget>
  `,
  styles: ``,
})
export class DividendHistoryWidget implements OnInit {
  private readonly store = inject(InvestmentStore);
  labels: string[] = [];
  datasets: any[] = [];

  plugins = {
    legend: {
      display: false,
    },
  };

  ngOnInit() {
    const data = this.store.dividends();
    const dataset = data?.map((d) =>
      d.dividends.reduce((a, b) => a + b.amount! * b.quantity!, 0),
    );
    this.labels = data?.map((d) => `${d.year}-${d.month}`) || [];
    this.datasets = [
      {
        label: 'Industry Allocation',
        data: dataset || [],
      },
    ];
  }
}

@Component({
  selector: 'app-dividend-summary',
  template: `
    <div class="summary-item">
      <div class="label">Total Dividends</div>
      <div class="value">{{ totalDividendAmount }}</div>
    </div>
    <div class="summary-item">
      <div class="label">Monthly Average</div>
      <div class="value">{{ monthlyAverage }}</div>
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

    .summary-item:hover {
      transform: translateY(-5px);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }

    .summary-item .label {
      font-size: 16px;
      font-weight: 500;
      color: #555;
      text-transform: capitalize;
    }

    .summary-item .value {
      font-size: 16px;
      font-weight: 600;
      color: #1e90ff;
    }

    @media (max-width: 768px) {
      .summary-item {
        flex-direction: column;
        text-align: center;
      }

      .summary-item .label,
      .summary-item .value {
        margin-bottom: 8px;
      }
    }
  `,
})
export class DividendSummaryWidget implements OnInit {
  private readonly store = inject(InvestmentStore);
  totalDividendAmount = '';
  monthlyAverage = '';
  dividendYield = '';
  dividendCurrency = '';

  ngOnInit() {
    this.setCurrency();
    const formattedValue = (value: number) => Math.abs(value).toFixed(2);
    const data = this.store.dividends();
    if (data) {
      const dividendAmount = data.reduce(
        (a, b) =>
          a + b.dividends.reduce((c, d) => c + d.amount! * d.quantity!, 0),
        0,
      );
      this.totalDividendAmount = `${this.dividendCurrency}${formattedValue(dividendAmount)}`;
      this.monthlyAverage =
        dividendAmount === 0
          ? `${this.dividendCurrency}0.00`
          : `${this.dividendCurrency}${formattedValue(dividendAmount / data.length)}`;
      const divYield = (dividendAmount / this.getTotalInvestment()) * 100;
      this.dividendYield = `${divYield.toFixed(2)}%`;
    }
  }

  setCurrency() {
    const portfolioCurrency = this.store.currentPortfolio()?.currency;
    if (portfolioCurrency === 'USD') {
      this.dividendCurrency = '$';
    } else if (portfolioCurrency === 'JPY') {
      this.dividendCurrency = '¥';
    }
  }

  getTotalInvestment() {
    return 1000;
  }
}

@Component({
  selector: 'app-dividend-table-widget',
  imports: [AsyncPipe, DividendTableComponent],
  template: `<app-dividend-table
    [dividends]="dividends$ | async"
  ></app-dividend-table>`,
  styles: ``,
})
export class DividendTableWidget implements OnInit {
  private readonly store = inject(InvestmentStore);
  dividends$: Observable<MonthlyDividend[] | null>;

  ngOnInit() {
    this.dividends$ = of(this.store.dividends());
  }
}
