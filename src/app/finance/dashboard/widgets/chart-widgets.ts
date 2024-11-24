import { Component, inject, OnInit } from '@angular/core';
import { ChartComponent } from '../../../components/widget/chartbox.component';
import { DashboardService } from '../dashboard.service';
import { TRANSACTION_TYPE_INCOME_ID } from '../../../shared/data/client.data';
import { DataService } from '../../../service/data.service';
import { ChartUtilityService } from '../chart-utils.service';
import { ChartWidgetBase } from './chart-widget-base';

@Component({
  selector: 'app-income-vs-payments',
  standalone: true,
  template: `
    <app-chart-widget
      [chartType]="'bar'"
      [labels]="chartUtility.getMonthList()"
      [datasets]="datasets"
      [options]="options"
    ></app-chart-widget>
  `,
  imports: [ChartWidgetBase],
})
export class CashFlowWidget implements OnInit {
  private dashboardService = inject(DashboardService);
  chartUtility = inject(ChartUtilityService);
  options = {
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };
  datasets: any[] = [];
  ngOnInit() {
    const data = this.dashboardService.dashboardData();
    const expenseData = this.chartUtility.prepareMonthlyDataset(
      data?.expense || [],
    );
    const paymentData = this.chartUtility.prepareMonthlyDataset(
      data?.payment || [],
    );
    const savingsData = this.chartUtility.prepareMonthlyDataset(
      data?.saving || [],
    );
    const pureExpenses: any[] = [];
    for (let i = 0; i < paymentData.length; i++) {
      pureExpenses.push(expenseData[i] - savingsData[i]);
    }

    this.datasets = [
      { label: 'Expense', data: pureExpenses, borderWidth: 1, fill: 'start' },
      { label: 'Payments', data: paymentData, borderWidth: 1, fill: 'start' },
      { label: 'Savings', data: savingsData, borderWidth: 1, fill: 'start' },
    ];
  }
}

@Component({
  selector: 'app-income-vs-payments',
  standalone: true,
  template: `
    <app-chart-widget
      [chartType]="'bar'"
      [labels]="chartUtility.getMonthList()"
      [datasets]="datasets"
    ></app-chart-widget>
  `,
  imports: [ChartWidgetBase],
})
export class IncomeVsPaymentsWidget implements OnInit {
  private dashboardService = inject(DashboardService);
  chartUtility = inject(ChartUtilityService);

  datasets: any[] = [];
  ngOnInit() {
    const data = this.dashboardService.dashboardData();
    const incomeData = this.chartUtility.prepareMonthlyDataset(
      data?.income || [],
    );
    const paymentData = this.chartUtility.prepareMonthlyDataset(
      data?.payment || [],
    );
    this.datasets = [
      { label: 'Income', data: incomeData, borderWidth: 1, fill: 'start' },
      { label: 'Payments', data: paymentData, borderWidth: 1, fill: 'start' },
    ];
  }
}

@Component({
  selector: 'app-income-vs-savings',
  standalone: true,
  template: `
    <app-chart-widget
      [chartType]="'bar'"
      [labels]="chartUtility.getMonthList()"
      [datasets]="datasets"
    ></app-chart-widget>
  `,
  imports: [ChartWidgetBase],
})
export class IncomeVsSavingsWidget implements OnInit {
  private dashboardService = inject(DashboardService);
  chartUtility = inject(ChartUtilityService);
  datasets: any[] = [];

  ngOnInit() {
    const data = this.dashboardService.dashboardData();
    const incomeData = this.chartUtility.prepareMonthlyDataset(
      data?.income || [],
    );
    const savingsData = this.chartUtility.prepareMonthlyDataset(
      data?.saving || [],
    );
    this.datasets = [
      { label: 'Income', data: incomeData, borderWidth: 1, fill: 'start' },
      { label: 'Savings', data: savingsData, borderWidth: 1, fill: 'start' },
    ];
  }
}

@Component({
  selector: 'app-monthly-expense-category',
  standalone: true,
  template: `
    <app-chart-widget
      [chartType]="'doughnut'"
      [labels]="labels"
      [datasets]="datasets"
    ></app-chart-widget>
  `,
  imports: [ChartWidgetBase],
})
export class MonthlyExpenseCategoryWidget implements OnInit {
  private dashboardService = inject(DashboardService);
  private chartUtility = inject(ChartUtilityService);
  private dataService = inject(DataService);

  labels: string[] = [];
  datasets: any[] = [];

  ngOnInit() {
    const transactionCategories = this.dataService.getAllCategories();
    const data = this.dashboardService.dashboardData()?.category_wise_expenses;
    const targetKey = this.chartUtility.currentMonthKey;
    const categorySum: any[] = [];
    const labelsItems = transactionCategories.filter(
      (x) => x.category_type !== TRANSACTION_TYPE_INCOME_ID,
    );
    if (data && targetKey in data) {
      const categoryData = data[targetKey];
      labelsItems.forEach((x) => {
        const categoryAmount = categoryData.find((y) => y.category_id === x.id);
        categorySum.push(categoryAmount?.amount ?? 0);
      });
    }

    this.labels = labelsItems.map((x) => x.category) || [];
    this.datasets = [{ label: 'Expenses', data: categorySum || [] }];
  }
}

@Component({
  selector: 'app-monthly-account-usage',
  standalone: true,
  imports: [ChartComponent, ChartWidgetBase],
  template: `
    <app-chart-widget
      [chartType]="'doughnut'"
      [labels]="labels"
      [datasets]="datasets"
    ></app-chart-widget>
  `,
  styles: ``,
})
export class MonthlyAccountUsageWidget implements OnInit {
  private dashboardService = inject(DashboardService);
  private chartUtility = inject(ChartUtilityService);
  private dataService = inject(DataService);

  labels: string[] = [];
  datasets: any[] = [];

  ngOnInit() {
    const creditAccounts = this.dataService.getAccounts();
    const data = this.dashboardService.dashboardData()?.account_wise_expenses;
    const targetKey = this.chartUtility.currentMonthKey;
    const categorySum: any[] = [];
    if (data && targetKey in data) {
      const categoryData = data[targetKey];
      creditAccounts.forEach((x) => {
        const categoryAmount = categoryData.find((y) => y.category_id === x.id);
        categorySum.push(categoryAmount?.amount ?? 0);
      });
    }
    this.labels = creditAccounts.map((x) => x.account_name) || [];
    this.datasets = [{ label: 'Expenses', data: categorySum || [] }];
  }
}

@Component({
  selector: 'app-monthly-payment-category',
  standalone: true,
  imports: [ChartComponent, ChartWidgetBase],
  template: ` <app-chart-widget
    [chartType]="'doughnut'"
    [labels]="labels"
    [datasets]="datasets"
  ></app-chart-widget>`,
  styles: ``,
})
export class MonthlyPaymentCategoryWidget implements OnInit {
  private dashboardService = inject(DashboardService);
  private chartUtility = inject(ChartUtilityService);
  private dataService = inject(DataService);
  labels: string[] = [];
  datasets: any[] = [];
  ngOnInit() {
    const transactions =
      this.dashboardService.dashboardData()?.payment_by_destination;
    const targetKey = this.chartUtility.currentMonthKey;
    let categorySum: any[] = [];
    let labels: any[] = [];
    if (transactions && targetKey in transactions) {
      const categoryData = transactions[targetKey];
      categorySum = categoryData.map((y) => y.amount ?? 0);
      labels = categoryData.map((y) => y.destination ?? y.destination_original);
    }
    this.labels = labels || [];
    this.datasets = [{ label: 'Expenses', data: categorySum || [] }];
  }
}

@Component({
  selector: 'app-top-expenses',
  standalone: true,
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
export class TopExpensesWidget implements OnInit {
  private dashboardService = inject(DashboardService);
  labels: string[] = [];
  datasets: any[] = [];
  options = {
    indexAxis: 'y',
  };
  ngOnInit() {
    const transactions =
      this.dashboardService.dashboardData()?.top_ten_expenses ?? [];
    this.labels = transactions?.map((x) => x.destination ?? '');
    this.datasets = [
      {
        label: 'Top Expenses',
        data: transactions?.map((x) => x.amount ?? 0) || [],
      },
    ];
  }
}
