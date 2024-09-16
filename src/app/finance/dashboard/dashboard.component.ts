import { Component, inject, OnInit } from '@angular/core';
import { MONTHS } from '../../data/client.data';
import { ActivatedRoute } from '@angular/router';
import { LoadingService } from '../../shared/loading/loading.service';
import {
  faCreditCard,
  faFileInvoiceDollar,
  faPiggyBank,
  faSackDollar,
} from '@fortawesome/free-solid-svg-icons';
import { DashboardResponse } from '../../model/dashboard';
import { DataService } from '../../service/data.service';

@Component({
  selector: 'app-transaction-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class TransactionDashboardComponent implements OnInit {
  today = new Date();
  currentYear = this.today.getFullYear();
  currentMonthNumber = this.today.getMonth() - 1;
  currentDataKey = `${this.currentYear}-${String(this.currentMonthNumber).padStart(2, '0')}-01`;
  currentMonthName: string = MONTHS.find(
    (x) => x.value == this.currentMonthNumber,
  )!.viewValue;
  childComponentsRendered = 0;
  totalChildComponents = 7;
  totalIncome = 0;
  totalExpenses = 0;
  totalPayments = 0;
  totalSavings = 0;
  dashboardData: DashboardResponse;
  monthlyExpenses: [[string, any, any]] = [['Month', 'Expense', 'Payment']];
  monthlyExpensesOptions: any;
  monthlyExpensesChartType: string = 'bar';
  yearSummary: [[string, any]] = [['Category', 'Total']];
  monthlyIncome: [[string, any, any]] = [['Month', 'Income', 'Savings']];
  monthlyIncomeOptions: any;
  monthlyIncomeChartType: string = 'bar';
  monthlySavings: [[string, any]] = [['Month', 'Amount']];
  monthlySavingsOptions: any;
  monthlySavingsChartType: string = 'bar';
  categoryWiseSum: [[string, any]] = [['Category', 'Total']];
  categoryWiseSumOptions: any;
  categoryWiseSumChartType: string = 'pie';
  paymentMethodWiseSum: [[string, any]] = [['Payment Method', 'Total']];
  paymentMethodWiseSumOptions: any;
  paymentMethodWiseSumChartType: string = 'pie';
  monthlyPayments: [[string, any]] = [['Month', 'Amount']];
  monthlyPaymentsOptions: any;
  monthlyPaymentsChartType: string = 'pie';
  categoryWiseSumValueOptions: any;
  categoryWiseSumValueChartType: string = 'bar';
  protected readonly faSackDollar = faSackDollar;
  protected readonly faPiggyBank = faPiggyBank;
  protected readonly faCreditCard = faCreditCard;
  protected readonly faFileInvoiceDollar = faFileInvoiceDollar;
  private loadingService = inject(LoadingService);
  private activatedRoute = inject(ActivatedRoute);
  private dataService = inject(DataService);
  PAYMENT_METHODS = this.dataService.getClientSettings().accounts;
  TRANSACTION_CATEGORIES =
    this.dataService.getClientSettings().transaction_categories;

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ finance }) => {
      this.dashboardData = finance;
    });
    this.prepareAnalytics();
    this.prepareData();
  }

  prepareAnalytics() {
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

  childRendered() {
    this.childComponentsRendered++;
    if (this.childComponentsRendered === this.totalChildComponents) {
      this.loadingService.loadingOff();
    }
  }

  prepareYearSummaryCard() {
    this.yearSummary.push(['Savings', this.totalSavings]);
    this.yearSummary.push(['Payments', this.totalPayments]);
  }

  private prepareData() {
    this.prepareYearSummaryCard();
    this.prepareMonthlyExpenseVsPaymentCard();
    this.prepareMonthlyIncomeVsSavingsCard();
    this.prepareLastMonthExpenseCategories();
    this.prepareLastMonthExpenses();
    this.preparePaymentMethodCard();
    this.prepareMonthlyPaymentsCard();
  }

  private prepareMonthlyExpenseVsPaymentCard() {
    MONTHS.forEach((months) => {
      const ex1 = this.dashboardData.expense.find(
        (x) => x.month === months.value,
      );
      const py1 = this.dashboardData.payment.find(
        (x) => x.month === months.value,
      );
      const expenseValue = ex1 ? ex1.amount : 0;
      const paymentValue = py1 ? py1.amount : 0;
      this.monthlyExpenses.push([months.viewValue, expenseValue, paymentValue]);
    });

    this.monthlyExpensesOptions = {
      title: `${this.currentYear} Monthly Expenses vs Payments`,
      width: 580,
      height: 300,
      colors: ['#cf5a5a', '#d59b6c'],
      chartArea: { left: 0, top: 20, width: '100%', height: '70%' },
      legend: { position: 'right', textStyle: { color: 'blue', fontSize: 10 } },
    };
  }

  private prepareMonthlyIncomeVsSavingsCard() {
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
      this.monthlySavings.push([months.viewValue, savingValue]);
      this.monthlyIncome.push([months.viewValue, incomeValue, savingValue]);
    });

    this.monthlyIncomeOptions = {
      title: `${this.currentYear} Monthly Income vs Savings`,
      width: 580,
      height: 300,
      colors: ['#87dc88', '#6cacd5'],
      chartArea: { left: 0, top: 20, width: '100%', height: '70%' },
      legend: { position: 'right', textStyle: { color: 'blue', fontSize: 10 } },
    };
    this.monthlySavingsOptions = {
      title: `${this.currentYear} Monthly Savings`,
      width: 580,
      height: 300,
      colors: ['#23c623'],
      chartArea: { left: 0, top: 20, width: '100%', height: '70%' },
      legend: { position: 'none', textStyle: { color: 'blue', fontSize: 10 } },
    };
  }

  private prepareLastMonthExpenseCategories() {
    const transactions = this.dashboardData.category_wise_expenses;
    if (this.currentDataKey in transactions) {
      const categoryData = transactions[this.currentDataKey];
      this.TRANSACTION_CATEGORIES.forEach((x) => {
        const categorySum = categoryData.find((y) => y.category_id === x.id);
        this.categoryWiseSum.push([
          x.category,
          categorySum ? categorySum.amount : 0,
        ]);
      });
    }

    this.categoryWiseSumOptions = {
      title: `${this.currentYear} ${this.currentMonthName} Expenses (%)`,
      width: 550,
      height: 300,
      pieHole: 0.2,
      pieSliceText: 'percentage',
      chartArea: { left: 30, top: 50, width: '90%', height: '70%' },
      is3D: true,
      pieSliceTextStyle: {
        color: 'black',
        textAlign: 'left',
        fontsize: '10px',
      },
      fontSize: 10,
      legend: { position: 'right' },
    };
  }

  private prepareLastMonthExpenses() {
    this.categoryWiseSumValueOptions = {
      title: `${this.currentYear} ${this.currentMonthName} Expenses (Value)`,
      width: 550,
      height: 300,
      is3D: true,
      bars: 'horizontal',
      chartArea: { left: 30, top: 50, width: '90%', height: '70%' },
      legend: { position: 'none' },
    };
  }

  private preparePaymentMethodCard() {
    const transactions = this.dashboardData.account_wise_expenses;
    if (this.currentDataKey in transactions) {
      const categoryData = transactions[this.currentDataKey];
      this.PAYMENT_METHODS.forEach((x) => {
        const categorySum = categoryData.find((y) => y.category_id === x.id);
        this.paymentMethodWiseSum.push([
          x.account_name,
          categorySum ? categorySum.amount : 0,
        ]);
      });
    }
    this.paymentMethodWiseSumOptions = {
      title: `${this.currentYear} ${this.currentMonthName} Payment Method`,
      width: 550,
      height: 300,
      is3D: true,
      fontSize: 12,
      chartArea: { left: 30, top: 50, width: '90%', height: '70%' },
      legend: {
        position: 'right',
        textStyle: { fontSize: 10, alignment: 'center' },
      },
    };
  }

  private prepareMonthlyPaymentsCard() {
    const transactions = this.dashboardData.payment_by_destination;
    if (this.currentDataKey in transactions) {
      const categoryData = transactions[this.currentDataKey];
      categoryData.forEach((x) => {
        this.monthlyPayments.push([
          x.destination ? x.destination : x.destination_original,
          x.amount,
        ]);
      });
    }
    this.monthlyPaymentsOptions = {
      title: `${this.currentYear} ${this.currentMonthName} Payments`,
      width: 550,
      height: 300,
      pieHole: 0.2,
      pieSliceText: 'percentage',
      chartArea: { left: 30, top: 50, width: '90%', height: '70%' },
      is3D: true,
      pieSliceTextStyle: {
        color: 'black',
        textAlign: 'left',
        fontsize: '10px',
      },
      fontSize: 10,
      legend: { position: 'right' },
    };
  }
}
