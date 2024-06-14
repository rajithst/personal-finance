import { Component, inject, OnInit } from '@angular/core';
import { SessionService } from '../service/session.service';
import {
  MONTHS,
  PAYMENT_METHODS,
  TRANSACTION_CATEGORIES,
} from '../../data/client.data';
import { ActivatedRoute } from '@angular/router';
import { LoadingService } from '../../shared/loading/loading.service';
import {
  faPiggyBank,
  faSackDollar,
  faCreditCard,
  faFileInvoiceDollar,
} from '@fortawesome/free-solid-svg-icons';
import { MonthlyTransaction } from '../model/transactions';

@Component({
  selector: 'app-transaction-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class TransactionDashboardComponent implements OnInit {
  protected readonly faSackDollar = faSackDollar;
  protected readonly faPiggyBank = faPiggyBank;
  protected readonly faCreditCard = faCreditCard;
  protected readonly faFileInvoiceDollar = faFileInvoiceDollar;

  today = new Date();
  currentMonthNumber = this.today.getMonth()-2;
  currentMonthName: string = MONTHS.find(
    (x) => x.value == this.currentMonthNumber,
  )!.viewValue;
  currentYear = this.today.getFullYear();
  childComponentsRendered = 0;
  totalChildComponents = 7;

  private loadingService = inject(LoadingService);
  private sessionService = inject(SessionService);
  private activatedRoute = inject(ActivatedRoute);
  sessionData = this.sessionService.getData();

  totalIncome = 0;
  totalExpenses = 0;
  totalPayments = 0;
  totalSavings = 0;

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ finance }) => {
      this.sessionService.setSessionData(finance);
      this.sessionData = this.sessionService.getData();
    });
    this.prepareAnalytics();
    this.prepareData();
  }

  monthlyExpenses: [[string, any, any]] = [['Month', 'Expense', 'Payment']];
  monthlyExpensesOptions: any;
  monthlyExpensesChartType: string = 'bar';

  yearSummary: [[string, any]] = [['Category', 'Total']];
  yearSummaryOptions: any;
  yearSummaryChartType: string = 'pie';

  monthlyIncome: [[string, any]] = [['Month', 'Amount']];
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

  prepareAnalytics() {
    this.totalIncome = this.sessionData.incomes
      .filter((x) => x.year === this.currentYear)
      .map((x) => x.total)
      .reduce((a, b) => a + b, 0);
    this.totalPayments = this.sessionData.payments
      .filter((x) => x.year === this.currentYear)
      .map((x) => x.total)
      .reduce((a, b) => a + b, 0);
    this.totalSavings = this.sessionData.saving
      .filter((x) => x.year === this.currentYear)
      .map((x) => x.total)
      .reduce((a, b) => a + b, 0);
    const expenses = this.sessionData.expenses
      .filter((x) => x.year === this.currentYear)
      .map((x) => x.total)
      .reduce((a, b) => a + b, 0);
    this.totalExpenses = expenses - this.totalSavings;
  }

  childRendered() {
    this.childComponentsRendered++;
    if (this.childComponentsRendered === this.totalChildComponents) {
      this.loadingService.loadingOff();
    }
  }

  private prepareData() {
    this.prepareYearSummaryCard();
    this.prepareMonthlyExpensesCard();
    this.prepareMonthlyIncomeCard();
    this.prepareMonthlySavingCard();
    this.prepareLastMonthExpenseCategories();
    this.prepareLastMonthExpenses();
    this.preparePaymentMethodCard();
    this.prepareMonthlyPaymentsCard();
  }

  prepareYearSummaryCard() {
    this.yearSummary.push(['Savings', this.totalSavings]);
    this.yearSummary.push(['Payments', this.totalPayments]);
  }
  private prepareMonthlyExpensesCard() {
    const expenses: MonthlyTransaction[] = this.sessionData.expenses.filter(
      (x) => x.year === this.currentYear,
    );
    const payments: MonthlyTransaction[] = this.sessionData.payments.filter(
      (x) => x.year === this.currentYear,
    );
    const ex1 = expenses.map((x) => [x.month_text, x.total]).reverse();
    const py1 = payments.map((x) => [x.month_text, x.total]).reverse();
    for (let i = 0; i < ex1.length; i++) {
      if (py1.length > i) {
        this.monthlyExpenses.push([ex1[i][0].toString(), ex1[i][1], py1[i][1]]);
      }
    }
    this.monthlyExpensesOptions = {
      title: `${this.currentYear} Monthly Expenses vs Payments`,
      width: 420,
      height: 250,
      is3D: true,
      legend: { position: 'bottom' },
    };
  }

  private prepareMonthlyIncomeCard() {
    const incomes = this.sessionData.incomes
      .filter((x) => x.year === this.currentYear)
      .map((x) => [x.month_text, x.total])
      .reverse();
    incomes.forEach((x) => {
      this.monthlyIncome.push([x[0].toString(), x[1]]);
    });

    this.monthlyIncomeOptions = {
      title: `${this.currentYear} Monthly Income`,
      width: 420,
      height: 250,
      is3D: true,
      legend: { position: 'none' },
    };
  }

  private prepareMonthlySavingCard() {
    const savings = this.sessionData.saving
      .filter((x) => x.year === this.currentYear)
      .map((x) => [x.month_text, x.total])
      .reverse();
    savings.forEach((x) => {
      this.monthlySavings.push([x[0].toString(), x[1]]);
    });
    this.monthlySavingsOptions = {
      title: `${this.currentYear} Monthly Savings`,
      width: 420,
      height: 250,
      is3D: true,
      legend: { position: 'none' },
    };
  }

  private prepareLastMonthExpenseCategories() {
    const transactions = this.sessionData.expenses.find(
      (x) => x.year === this.currentYear && x.month === this.currentMonthNumber,
    );
    if (transactions) {
      TRANSACTION_CATEGORIES.forEach((x) => {
        const cSum = transactions.transactions
          .filter((y) => y.category == x.value)
          .reduce((acc, transaction) => acc + transaction.amount!, 0);
        this.categoryWiseSum.push([x.viewValue, cSum]);
      });
    }
    this.categoryWiseSumOptions = {
      title: `${this.currentYear} ${this.currentMonthName} Expenses (%)`,
      width: 500,
      height: 350,
      pieHole: 0.2,
      pieSliceText: 'percentage',
      chartArea: { left: 30, top: 50, width: '90%', height: '70%' },
      pieSliceTextStyle: {
        color: 'black',
        textAlign: 'left',
        fontsize: '10px',
      },
      fontSize: 12,
      legend: { position: 'right' },
    };
  }

  private prepareLastMonthExpenses() {
    this.categoryWiseSumValueOptions = {
      title: `${this.currentYear} ${this.currentMonthName} Expenses (Value)`,
      width: 300,
      height: 350,
      is3D: true,
      bars: 'horizontal',
      legend: { position: 'none' },
    };
  }

  private preparePaymentMethodCard() {
    const transactions = this.sessionData.expenses.find(
      (x) => x.year === this.currentYear && x.month === this.currentMonthNumber,
    );
    if (transactions) {
      PAYMENT_METHODS.forEach((x) => {
        const pmSum = transactions.transactions
          .filter((y) => y.payment_method === x.value)
          .reduce((acc, transaction) => acc + transaction.amount!, 0);
        this.paymentMethodWiseSum.push([x.viewValue, pmSum]);
      });
    }
    this.paymentMethodWiseSumOptions = {
      title: `${this.currentYear} ${this.currentMonthName} Payment Method`,
      width: 350,
      height: 300,
      is3D: true,
      fontSize: 12,
      chartArea: { left: 0, right: 0, top: 40, width: '100%', height: '70%' },
      legend: {
        position: 'right',
        textStyle: { fontSize: 10, alignment: 'center' },
      },
    };
  }

  private prepareMonthlyPaymentsCard() {
    const monthlyPayments = this.sessionData.payments.find(
      (x) => x.year === this.currentYear && x.month === this.currentMonthNumber,
    );
    if (monthlyPayments) {
      const payments = monthlyPayments.transactions.map((x) => [
        x.alias ? x.alias : x.destination,
        x.amount,
      ]);
      payments.forEach((x) => {
        this.monthlyPayments.push([x[0]!.toString(), x[1]]);
      });
    }
    this.monthlyPaymentsOptions = {
      title: `${this.currentYear} ${this.currentMonthName} Payments`,
      width: 500,
      height: 350,
      pieHole: 0.2,
      pieSliceText: 'percentage',
      chartArea: { left: 30, top: 50, width: '90%', height: '70%' },
      pieSliceTextStyle: {
        color: 'black',
        textAlign: 'left',
        fontsize: '10px',
      },
      fontSize: 12,
      legend: { position: 'right' },
    };
  }
}
