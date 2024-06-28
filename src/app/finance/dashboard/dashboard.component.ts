import { Component, inject, OnInit } from '@angular/core';
import {SessionData, SessionService} from '../service/session.service';
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

  private loadingService = inject(LoadingService);
  private sessionService = inject(SessionService);
  private activatedRoute = inject(ActivatedRoute);
  private sessionData: SessionData = this.sessionService.getData();

  today = new Date();
  currentMonthNumber = this.today.getMonth()-1;
  currentMonthName: string = MONTHS.find(
    (x) => x.value == this.currentMonthNumber,
  )!.viewValue;
  currentYear = this.today.getFullYear();
  childComponentsRendered = 0;
  totalChildComponents = 7;
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
    this.prepareMonthlyExpenseVsPaymentCard();
    this.prepareMonthlyIncomeVsSavingsCard();
    this.prepareLastMonthExpenseCategories();
    this.prepareLastMonthExpenses();
    this.preparePaymentMethodCard();
    this.prepareMonthlyPaymentsCard();
  }

  prepareYearSummaryCard() {
    this.yearSummary.push(['Savings', this.totalSavings]);
    this.yearSummary.push(['Payments', this.totalPayments]);
  }
  private prepareMonthlyExpenseVsPaymentCard() {

    const expenses: MonthlyTransaction[] = this.sessionData.expenses.filter(
      (x) => x.year === this.currentYear,
    );
    const payments: MonthlyTransaction[] = this.sessionData.payments.filter(
      (x) => x.year === this.currentYear,
    )
    MONTHS.forEach((months) => {
      const ex1 = expenses.find(x => x.month === months.value);
      const py1 = payments.find(x => x.month === months.value);
      const expenseValue = ex1 ? ex1.total : 0;
      const paymentValue = py1 ? py1.total : 0;
      this.monthlyExpenses.push([months.viewValue, expenseValue, paymentValue]);
    })

    this.monthlyExpensesOptions = {
      title: `${this.currentYear} Monthly Expenses vs Payments`,
      width: 400,
      height: 300,
      colors: ['#cf5a5a', '#d59b6c'],
      chartArea: { left: 0, top: 20, width: '100%', height: '70%' },
      legend: { position: 'right', textStyle: {color: 'blue', fontSize: 10}},
    };
  }

  private prepareMonthlyIncomeVsSavingsCard() {
    const incomes = this.sessionData.incomes.filter((x) => x.year === this.currentYear)
    const savings = this.sessionData.saving.filter((x) => x.year === this.currentYear)
    MONTHS.forEach((months) => {
      const inc = incomes.find(x => x.month === months.value);
      const sav = savings.find(x => x.month === months.value);
      const incomeValue = inc ? inc.total : 0;
      const savingValue = sav ? sav.total : 0;
      this.monthlySavings.push([months.viewValue, savingValue])
      this.monthlyIncome.push([months.viewValue, incomeValue, savingValue]);
    })

    this.monthlyIncomeOptions = {
      title: `${this.currentYear} Monthly Income`,
      width: 400,
      height: 300,
      colors: ['#87dc88', '#6cacd5'],
      chartArea: { left: 0, top: 20, width: '100%', height: '70%' },
      legend: { position: 'right', textStyle: {color: 'blue', fontSize: 10}},
    };
    this.monthlySavingsOptions = {
      title: `${this.currentYear} Monthly Savings`,
      width: 400,
      height: 300,
      colors: ['#23c623'],
      chartArea: { left: 0, top: 20, width: '100%', height: '70%' },
      legend: { position: 'none', textStyle: {color: 'blue', fontSize: 10}},
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
      width: 400,
      height: 300,
      pieHole: 0.2,
      pieSliceText: 'percentage',
      chartArea: { left: 10, top: 50, width: '80%', height: '70%' },
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
      width: 400,
      height: 300,
      is3D: true,
      bars: 'horizontal',
      chartArea: { left: 10, top: 50, width: '100%', height: '70%' },
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
      width: 400,
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
      width: 400,
      height: 300,
      pieHole: 0.2,
      pieSliceText: 'percentage',
      chartArea: { left: 10, top: 50, width: '80%', height: '70%' },
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
