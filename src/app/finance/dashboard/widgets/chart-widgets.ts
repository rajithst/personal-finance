import { Component, inject, input, OnInit } from '@angular/core';
import {
  ChartComponent,
  ChartConfig,
} from '../../../components/widget/chartbox.component';
import { DashboardService } from '../../../service/dashboard.service';
import { MONTHS } from '../../../shared/data/client.data';
import { DropDownType } from '../../../shared/data/shared.data';
import { TransactionCategory } from '../../model/common';
import { DataService } from '../../../service/data.service';
import { CreditAccount } from '../../model/account';

@Component({
  selector: 'app-income-vs-payments',
  standalone: true,
  imports: [ChartComponent],
  template: ` <app-chart [chartConfig]="chartConfig"></app-chart>`,
  styles: ``,
})
export class IncomeVsPaymentsWidget implements OnInit {
  dashboardService = inject(DashboardService);
  today = new Date();
  currentYear = this.today.getFullYear();
  chartConfig: ChartConfig = {
    type: 'line',
    data: [],
    options: {},
  };
  ngOnInit() {
    this.prepare();
  }

  private prepare() {
    const incomes = this.dashboardService
      .dashboardData()
      ?.income.filter((x) => x.year === this.currentYear);
    const payments = this.dashboardService
      .dashboardData()
      ?.payment.filter((x) => x.year === this.currentYear);
    const months = MONTHS.map((month) => month.viewValue);
    const incomeDataset: any[] = [];
    const paymentDataset: any[] = [];
    MONTHS.forEach((months) => {
      const inc = incomes?.find((x) => x.month === months.value);
      const pay = payments?.find((x) => x.month === months.value);
      const incomeValue = inc ? inc.amount : 0;
      const paymentValue = pay ? pay.amount : 0;
      incomeDataset.push(incomeValue);
      paymentDataset.push(paymentValue);
    });
    const dataset = {
      labels: months,
      datasets: [
        {
          label: 'Income',
          data: incomeDataset,
          borderWidth: 1,
          fill: 'start',
        },
        {
          label: 'Payment',
          data: paymentDataset,
          borderWidth: 1,
          fill: 'start',
        },
      ],
    };
    this.chartConfig = {
      type: 'bar',
      data: dataset,
      options: {},
    };
  }
}

@Component({
  selector: 'app-income-vs-savings',
  standalone: true,
  imports: [ChartComponent],
  template: ` <app-chart [chartConfig]="chartConfig"></app-chart>`,
  styles: ``,
})
export class IncomeVsSavingsWidget implements OnInit {
  dashboardService = inject(DashboardService);
  today = new Date();
  currentYear = this.today.getFullYear();
  chartConfig: ChartConfig = {
    type: 'line',
    data: [],
    options: {},
  };

  ngOnInit() {
    this.prepare();
  }

  private prepare() {
    const incomes = this.dashboardService
      .dashboardData()
      ?.income.filter((x) => x.year === this.currentYear);
    const savings = this.dashboardService
      .dashboardData()
      ?.saving.filter((x) => x.year === this.currentYear);
    const months = MONTHS.map((month) => month.viewValue);
    const incomeDataset: any[] = [];
    const savingsDataset: any[] = [];
    MONTHS.forEach((months) => {
      const inc = incomes?.find((x) => x.month === months.value);
      const sav = savings?.find((x) => x.month === months.value);
      const incomeValue = inc ? inc.amount : 0;
      const savingValue = sav ? sav.amount : 0;
      incomeDataset.push(incomeValue);
      savingsDataset.push(savingValue);
    });
    const dataset = {
      labels: months,
      datasets: [
        {
          label: 'Income',
          data: incomeDataset,
          borderWidth: 1,
          fill: 'start',
        },
        {
          label: 'Savings',
          data: savingsDataset,
          borderWidth: 1,
          fill: 'start',
        },
      ],
    };
    this.chartConfig = {
      type: 'bar',
      data: dataset,
      options: {},
    };
  }
}

@Component({
  selector: 'app-monthly-expense-category',
  standalone: true,
  imports: [ChartComponent],
  template: ` <app-chart [chartConfig]="chartConfig"></app-chart>`,
  styles: ``,
})
export class MonthlyExpenseCategoryWidget implements OnInit {
  private readonly dashboardService = inject(DashboardService);
  private readonly dataService = inject(DataService);
  today = new Date();
  currentYear = this.today.getFullYear();
  currentMonthNumber = this.today.getMonth() - 1;
  TRANSACTION_CATEGORIES: TransactionCategory[] = [];

  chartConfig: ChartConfig = {
    type: 'doughnut',
    data: {},
    options: {},
  };

  ngOnInit() {
    this.TRANSACTION_CATEGORIES = this.dataService.getAllCategories();
    this.render();
  }

  render() {
    const defaultTarget: DropDownType = MONTHS.find(
      (x) => x.value === this.currentMonthNumber,
    )!;
    this.prepare(defaultTarget);
  }

  private prepare(target: DropDownType) {
    const transactions =
      this.dashboardService.dashboardData()?.category_wise_expenses;
    const targetKey = `${this.currentYear}-${String(target.value).padStart(2, '0')}-01`;
    const categorySum: any[] = [];
    if (transactions && targetKey in transactions) {
      const categoryData = transactions[targetKey];
      this.TRANSACTION_CATEGORIES.filter(
        (x) => x.category !== 'Income',
      ).forEach((x) => {
        const categoryAmount = categoryData.find((y) => y.category_id === x.id);
        categorySum.push(categoryAmount?.amount ?? 0);
      });
    }
    const dataset = {
      labels: this.TRANSACTION_CATEGORIES.map((x) => x.category),
      datasets: [
        {
          label: 'Expenses',
          data: categorySum,
        },
      ],
    };
    this.chartConfig = {
      type: 'doughnut',
      data: dataset,
      options: {
        legend: {
          position: 'top',
        },
        tooltip: {
          enabled: true,
        },
      },
    };
  }
}

@Component({
  selector: 'app-monthly-account-usage',
  standalone: true,
  imports: [ChartComponent],
  template: ` <app-chart [chartConfig]="chartConfig"></app-chart>`,
  styles: ``,
})
export class MonthlyAccountUsageWidget implements OnInit {
  private readonly dashboardService = inject(DashboardService);
  private readonly dataService = inject(DataService);
  today = new Date();
  currentYear = this.today.getFullYear();
  currentMonthNumber = this.today.getMonth() - 1;
  CREDIT_ACCOUNTS: CreditAccount[] = [];

  chartConfig: ChartConfig = {
    type: 'doughnut',
    data: {},
    options: {},
  };
  ngOnInit() {
    this.CREDIT_ACCOUNTS = this.dataService.getAccounts();
    this.render();
  }

  render() {
    const defaultTarget: DropDownType = MONTHS.find(
      (x) => x.value === this.currentMonthNumber,
    )!;
    this.prepare(defaultTarget);
  }
  prepare(target: DropDownType) {
    const transactions =
      this.dashboardService.dashboardData()?.account_wise_expenses;
    const targetKey = `${this.currentYear}-${String(target.value).padStart(2, '0')}-01`;
    const categorySum: any[] = [];
    if (transactions && targetKey in transactions) {
      const categoryData = transactions[targetKey];
      this.CREDIT_ACCOUNTS.forEach((x) => {
        const categoryAmount = categoryData.find((y) => y.category_id === x.id);
        categorySum.push(categoryAmount?.amount ?? 0);
      });
    }

    const dataset = {
      labels: this.CREDIT_ACCOUNTS.map((x) => x.account_name),
      datasets: [
        {
          label: 'Account Name',
          data: categorySum,
        },
      ],
    };
    this.chartConfig = {
      type: 'doughnut',
      data: dataset,
      options: {
        legend: {
          position: 'top',
        },
        tooltip: {
          enabled: true,
        },
      },
    };
  }
}

@Component({
  selector: 'app-monthly-payment-category',
  standalone: true,
  imports: [ChartComponent],
  template: ` <app-chart [chartConfig]="chartConfig"></app-chart>`,
  styles: ``,
})
export class MonthlyPaymentCategoryWidget implements OnInit {
  private readonly dashboardService = inject(DashboardService);
  private readonly dataService = inject(DataService);
  today = new Date();
  currentYear = this.today.getFullYear();
  currentMonthNumber = this.today.getMonth() - 1;
  TRANSACTION_CATEGORIES: TransactionCategory[] = [];

  chartConfig: ChartConfig = {
    type: 'doughnut',
    data: {},
    options: {},
  };

  ngOnInit() {
    this.TRANSACTION_CATEGORIES = this.dataService.getAllCategories();
    this.render();
  }

  render() {
    const defaultTarget: DropDownType = MONTHS.find(
      (x) => x.value === this.currentMonthNumber,
    )!;
    this.prepare(defaultTarget);
  }
  private prepare(target: DropDownType) {
    const transactions =
      this.dashboardService.dashboardData()?.payment_by_destination;
    const targetKey = `${this.currentYear}-${String(target.value).padStart(2, '0')}-01`;
    let categorySum: any[] = [];
    let labels: any[] = [];
    if (transactions && targetKey in transactions) {
      const categoryData = transactions[targetKey];
      categorySum = categoryData.map((y) => y.amount ?? 0);
      labels = categoryData.map((y) => y.destination ?? y.destination_original);
    }
    const dataset = {
      labels: labels,
      datasets: [
        {
          label: 'Payments',
          data: categorySum,
        },
      ],
    };
    this.chartConfig = {
      type: 'doughnut',
      data: dataset,
      options: {
        legend: {
          position: 'top',
        },
        tooltip: {
          enabled: true,
        },
      },
    };
  }
}
