import { Component, inject, OnDestroy } from '@angular/core';
import { MONTHS } from '../../shared/data/client.data';
import {
  faCreditCard,
  faFileInvoiceDollar,
  faPiggyBank,
  faSackDollar,
} from '@fortawesome/free-solid-svg-icons';
import {
  BAR_CHART_CONFIG,
  BAR_MULTI_CHART_CONFIG,
  ChartData,
  ChartOptionSwitchEmit,
  DashboardResponse,
  HORIZONTAL_BAR_CHART_CONFIG,
  KeyValueArray,
  PIE_CHART_CONFIG,
} from '../model/dashboard';
import { DataService } from '../../service/data.service';
import {DropDownType} from '../../shared/data/shared.data';
import {
  forkJoin,
  Observable,
  of,
  ReplaySubject,
  takeUntil,
} from 'rxjs';
import { ApiService } from '../../core/api.service';
import {CreditAccount} from "../model/account";
import {TransactionCategory} from "../model/common";
import { AsyncPipe, DecimalPipe } from '@angular/common';
import { ChartboxComponent } from '../../shared/chartbox/chartbox.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatGridList, MatGridTile } from '@angular/material/grid-list';

@Component({
    selector: 'app-transaction-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css',
    standalone: true,
    imports: [
        MatGridList,
        MatGridTile,
        MatCard,
        MatCardContent,
        FaIconComponent,
        ChartboxComponent,
        AsyncPipe,
        DecimalPipe,
    ],
})
export class TransactionDashboardComponent implements OnDestroy {
  today = new Date();
  currentYear = this.today.getFullYear();
  currentMonthNumber = this.today.getMonth() - 1;
  currentDataKey = `${this.currentYear}-${String(this.currentMonthNumber).padStart(2, '0')}-01`;
  currentMonthName: string = MONTHS.find(
    (x) => x.value == this.currentMonthNumber,
  )!.viewValue;
  totalIncome = 0;
  totalExpenses = 0;
  totalPayments = 0;
  totalSavings = 0;
  dashboardData: DashboardResponse;
  loading = true;

  categoryWiseExpenseSum$: Observable<ChartData>;
  categoryWiseExpenseValueSum$: Observable<ChartData>;
  monthlyExpenseVsPaymentSum$: Observable<ChartData>;
  monthlyIncomeVsSavingsSum$: Observable<ChartData>;
  monthlySavings$: Observable<ChartData>;
  accountWiseExpenseSum$: Observable<ChartData>;
  destinationWisePaymentSum$: Observable<ChartData>;

  protected readonly faSackDollar = faSackDollar;
  protected readonly faPiggyBank = faPiggyBank;
  protected readonly faCreditCard = faCreditCard;
  protected readonly faFileInvoiceDollar = faFileInvoiceDollar;
  private readonly dataService = inject(DataService);
  private readonly apiService = inject(ApiService);
  protected readonly destroyed$ = new ReplaySubject<void>(1);

  CREDIT_ACCOUNTS: CreditAccount[] = [];
  TRANSACTION_CATEGORIES: TransactionCategory[] = [];

  constructor() {
    const settings$ = this.apiService.initSettings();
    const dashboard$ = this.apiService.getDashboard();

    forkJoin({ settings: settings$, dashboard: dashboard$ })
      .pipe(takeUntil(this.destroyed$))
      .subscribe(({ settings, dashboard }) => {
        this.dataService.setClientSettings(settings);
        this.CREDIT_ACCOUNTS = this.dataService.getAccounts();
        this.TRANSACTION_CATEGORIES = this.dataService.getAllCategories();
        this.dashboardData = dashboard;
        this.prepareAnalytics();
        this.renderCharts();
      });
  }

  switchOption(data: ChartOptionSwitchEmit | null) {
    if (!data) {
      return;
    }
    const switcher = data.chartSwitch;
    if (data.chartKey === 'categoryWiseExpenseSum') {
      this.prepareLastMonthExpenseCategories(switcher);
    } else if (data.chartKey === 'accountWiseExpenseSum') {
      this.prepareMonthlyAccountExpenses(switcher);
    } else if (data.chartKey === 'destinationWisePaymentSum') {
      this.prepareMonthlyPaymentsCard(switcher);
    }
  }
  private prepareAnalytics() {
    this.totalIncome = this.dashboardData.income
      .filter((x) => x.year === this.currentYear)
      .map((x) => x.amount)
      .reduce((a, b) => a + b, 0);
    this.totalPayments = this.dashboardData.payment
      .filter((x) => x.year === this.currentYear)
      .map((x) => x.amount)
      .reduce((a, b) => a + b, 0);
    this.totalSavings = this.dashboardData.saving
      .filter((x) => x.year === this.currentYear)
      .map((x) => x.amount)
      .reduce((a, b) => a + b, 0);
    const expenses = this.dashboardData.expense
      .filter((x) => x.year === this.currentYear)
      .map((x) => x.amount)
      .reduce((a, b) => a + b, 0);
    this.totalExpenses = expenses - this.totalSavings;
  }

  private renderCharts() {
    const defaultTarget: DropDownType = MONTHS.find(
      (x) => x.value === this.currentMonthNumber,
    )!;
    this.prepareMonthlyIncomeVsSavingsCard();
    this.prepareMonthlyExpenseVsPaymentCard();
    this.prepareMonthlySavings();
    this.prepareLastMonthExpenseCategories(defaultTarget);
    this.prepareMonthlyAccountExpenses(defaultTarget);
    this.prepareMonthlyPaymentsCard(defaultTarget);
  }

  private prepareMonthlyExpenseVsPaymentCard() {
    const data: KeyValueArray = [['Month', 'Expense', 'Payment']];
    MONTHS.forEach((months) => {
      const ex1 = this.dashboardData.expense.find(
        (x) => x.month === months.value,
      );
      const py1 = this.dashboardData.payment.find(
        (x) => x.month === months.value,
      );
      const expenseValue = ex1 ? ex1.amount : 0;
      const paymentValue = py1 ? py1.amount : 0;
      data.push([months.viewValue, expenseValue, paymentValue]);
    });
    const options = JSON.parse(JSON.stringify(BAR_MULTI_CHART_CONFIG));
    options.title = `${this.currentYear} Expense VS Payment`;
    const mapData: ChartData = {
      chartKey: 'expenseVsPayment',
      data: data,
      options: options,
      chartType: 'bar',
      chartSwitches: null,
    };
    this.monthlyExpenseVsPaymentSum$ = of(mapData);
  }

  private prepareMonthlyIncomeVsSavingsCard() {
    const data: KeyValueArray = [['Month', 'Income', 'Savings']];
    const incomes = this.dashboardData.income.filter(
      (x) => x.year === this.currentYear,
    );
    const savings = this.dashboardData.saving.filter(
      (x) => x.year === this.currentYear,
    );
    MONTHS.forEach((months) => {
      const inc = incomes.find((x) => x.month === months.value);
      const sav = savings.find((x) => x.month === months.value);
      const incomeValue = inc ? inc.amount : 0;
      const savingValue = sav ? sav.amount : 0;
      data.push([months.viewValue, incomeValue, savingValue]);
    });
    const options = JSON.parse(JSON.stringify(BAR_MULTI_CHART_CONFIG));
    options.title = `${this.currentYear} Income VS Savings`;
    const mapData: ChartData = {
      chartKey: 'incomeVsSavings',
      data: data,
      options: options,
      chartType: 'bar',
      chartSwitches: null,
    };
    this.monthlyIncomeVsSavingsSum$ = of(mapData);
  }

  private prepareLastMonthExpenseCategories(target: DropDownType) {
    const transactions = this.dashboardData.category_wise_expenses;
    const targetKey = `${this.currentYear}-${String(target.value).padStart(2, '0')}-01`;
    let data: KeyValueArray = [['Category', 'Total']];
    if (targetKey in transactions) {
      const categoryData = transactions[targetKey];
      this.TRANSACTION_CATEGORIES.filter(x => x.category !== 'Income').forEach((x) => {
        const categorySum = categoryData.find((y) => y.category_id === x.id);
        data.push([x.category, categorySum ? categorySum.amount : 0]);
      });
    }

    const pieChartOptions = JSON.parse(JSON.stringify(PIE_CHART_CONFIG));
    pieChartOptions.title = `${this.currentYear} ${target.viewValue} expenses`;
    const mapData: ChartData = {
      chartKey: 'categoryWiseExpenseSum',
      data: data,
      options: pieChartOptions,
      chartType: 'pie',
      chartSwitches: MONTHS,
    };
    this.categoryWiseExpenseSum$ = of(mapData);

    const barChartOptions = HORIZONTAL_BAR_CHART_CONFIG;
    barChartOptions.title = `${this.currentYear} ${target.viewValue} expenses (Value)`;
    const horizontalBarData: ChartData = {
      chartKey: 'categoryWiseExpenseSum',
      data: data,
      options: barChartOptions,
      chartType: 'bar',
      chartSwitches: MONTHS,
    };
    this.categoryWiseExpenseValueSum$ = of(horizontalBarData);
  }

  private prepareMonthlySavings() {
    const transactions = this.dashboardData.saving;
    let data: KeyValueArray = [['Category', 'Total']];
    MONTHS.forEach((months) => {
      const savings = transactions.find(
        (x) => x.year === this.currentYear && x.month === months.value,
      );
      const savingsValue = savings ? savings.amount : 0;
      data.push([months.viewValue, savingsValue]);
    });
    const options = JSON.parse(JSON.stringify(BAR_CHART_CONFIG));
    options.title = `${this.currentYear} Monthly Savings`;
    const mapData: ChartData = {
      chartKey: 'monthlySavings',
      data: data,
      options: options,
      chartType: 'bar',
      chartSwitches: null,
    };
    this.monthlySavings$ = of(mapData);
  }

  private prepareMonthlyAccountExpenses(target: DropDownType) {
    const transactions = this.dashboardData.account_wise_expenses;
    const targetKey = `${this.currentYear}-${String(target.value).padStart(2, '0')}-01`;
    const data: KeyValueArray = [['Account', 'Total']];
    if (targetKey in transactions) {
      const categoryData = transactions[this.currentDataKey];
      this.CREDIT_ACCOUNTS.forEach((x) => {
        const categorySum = categoryData.find((y) => y.category_id === x.id);
        data.push([x.account_name, categorySum ? categorySum.amount : 0]);
      });
    }
    const pieChartOptions = JSON.parse(JSON.stringify(PIE_CHART_CONFIG));
    pieChartOptions.title = `${this.currentYear} ${target.viewValue} account`;
    const mapData: ChartData = {
      chartKey: 'accountWiseExpenseSum',
      data: data,
      options: pieChartOptions,
      chartType: 'pie',
      chartSwitches: MONTHS,
    };
    this.accountWiseExpenseSum$ = of(mapData);
  }

  private prepareMonthlyPaymentsCard(target: DropDownType) {
    const transactions = this.dashboardData.payment_by_destination;
    const targetKey = `${this.currentYear}-${String(target.value).padStart(2, '0')}-01`;
    const data: KeyValueArray = [['Payment', 'Total']];
    if (targetKey in transactions) {
      const categoryData = transactions[targetKey];
      categoryData.forEach((x) => {
        data.push([
          x.destination ? x.destination : x.destination_original,
          x.amount,
        ]);
      });
    }
    const pieChartOptions = JSON.parse(JSON.stringify(PIE_CHART_CONFIG));
    pieChartOptions.title = `${this.currentYear} ${target.viewValue} payments`;
    const mapData: ChartData = {
      chartKey: 'destinationWisePaymentSum',
      data: data,
      options: pieChartOptions,
      chartType: 'pie',
      chartSwitches: MONTHS,
    };
    this.destinationWisePaymentSum$ = of(mapData);
  }
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
