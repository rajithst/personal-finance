import {Component, inject, OnInit} from '@angular/core';
import {SessionService} from "../service/session.service";
import {MONTHS, PAYMENT_METHODS, TRANSACTION_CATEGORIES} from "../../data/client.data";
import {ActivatedRoute,} from "@angular/router";
import {LoadingService} from "../../shared/loading/loading.service";
import {faCaretDown, faCaretUp, faJpy, faLineChart, faMoneyBill} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-transaction-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class TransactionDashboardComponent implements OnInit {


  today = new Date();
  currentMonthNumber = this.today.getMonth();
  currentMonthName: string = MONTHS.find(x => x.value == this.currentMonthNumber)!.viewValue
  currentYear = this.today.getFullYear();
  childComponentsRendered = 0;
  totalChildComponents = 7;

  private loadingService = inject(LoadingService);
  private sessionService = inject(SessionService);
  private activatedRoute = inject(ActivatedRoute);
  sessionData = this.sessionService.getData();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({finance}) => {
      this.sessionService.setSessionData(finance)
      this.sessionData = this.sessionService.getData()
    });
    this.prepareData();
  }

  childRendered() {
    this.childComponentsRendered++;
    if (this.childComponentsRendered === this.totalChildComponents) {
      this.loadingService.loadingOff()
    }
  }

  monthlyExpenses: any = [];
  monthlyExpensesOptions: any;
  monthlyExpensesChartType: string = 'bar';

  monthlyIncome: any = [];
  monthlyIncomeOptions: any;
  monthlyIncomeChartType: string = 'bar';

  monthlySavings: any = [];
  monthlySavingsOptions: any;
  monthlySavingsChartType: string = 'bar';

  categoryWiseSum: [[string, any]] = [['Category', 'Total']];
  categoryWiseSumOptions: any;
  categoryWiseSumChartType: string = 'pie';

  paymentMethodWiseSum: [[string, any]] = [['Payment Method', 'Total']];
  paymentMethodWiseSumOptions: any;
  paymentMethodWiseSumChartType: string = 'pie';

  monthlyPayments: any = [];
  monthlyPaymentsOptions: any;
  monthlyPaymentsChartType: string = 'pie';

  categoryWiseSumValueOptions: any;
  categoryWiseSumValueChartType: string = 'bar';

  private prepareData() {
    this.prepareMonthlyExpensesCard()
    this.prepareMonthlyIncomeCard()
    this.prepareMonthlySavingCard()
    this.prepareLastMonthExpenseCategories()
    this.prepareLastMonthExpenses()
    this.preparePaymentMethodCard()
    this.prepareMonthlyPaymentsCard()
  }

  private prepareMonthlyExpensesCard() {
    const expenses = this.sessionData.expenses.filter(x => x.year === this.currentYear).map(x => [x.month_text, x.total]).reverse()
    const payments = this.sessionData.payments.filter(x => x.year === this.currentYear).map(x => [x.month_text, x.total]).reverse()
    const expensesData = [];
    for (let i = 0; i < expenses.length; i++) {
      if (payments.length > i) {
        expensesData.push([...expenses[i], payments[i][1]])
      }
    }
    this.monthlyExpenses = [...expensesData]
    this.monthlyExpenses.unshift(['Month', 'Expense', 'Payment'])
    this.monthlyExpensesOptions = {
      title: `${this.currentYear} Monthly Expenses vs Payments`,
      width:420,
      height:300,
      is3D: true,
      legend: {position: 'bottom'}
    }
  }

  private prepareMonthlyIncomeCard() {
    const incomes = this.sessionData.incomes.filter(x => x.year === this.currentYear).map(x => [x.month_text, x.total]).reverse()
    this.monthlyIncome = [...incomes]
    this.monthlyIncome.unshift(['Month', 'Amount'])
    this.monthlyIncomeOptions = {
      title: `${this.currentYear} Monthly Income`,
      width:420,
      height:300,
      is3D: true,
      legend: {position: 'none'}
    }
  }

  private prepareMonthlySavingCard() {
    const savings = this.sessionData.saving.filter(x => x.year === this.currentYear).map(x => [x.month_text, x.total]).reverse()
    this.monthlySavings = [...savings]
    this.monthlySavings.unshift(['Month', 'Amount'])
    this.monthlySavingsOptions = {
      title: `${this.currentYear} Monthly Savings`,
      width:420,
      height:300,
      is3D: true,
      legend: {position: 'none'}
    }
  }

  private prepareLastMonthExpenseCategories() {
    const transactions = this.sessionData.expenses.filter(x => x.year === this.currentYear && x.month===this.currentMonthNumber).map(x => x.transactions_cp)[0]
    if (transactions && transactions.length > 0) {
      TRANSACTION_CATEGORIES.forEach(x => {
        const cSum = transactions.filter(y => y.category == x.value).reduce((acc, transaction) => acc + transaction.amount!, 0);
        this.categoryWiseSum.push([x.viewValue, cSum])
      })
    }
    this.categoryWiseSumOptions = {
      title: `${this.currentYear} ${this.currentMonthName} Expenses (%)`,
      width:350,
      height:300,
      is3D: true,
      chartArea:{left:10,top:30,width:'100%',height:'90%'},
      fontSize: 12,
      legend: {position: 'right', textStyle: { fontSize: 10, alignment: 'center'}}
    }
  }

  private prepareLastMonthExpenses() {
    this.categoryWiseSumValueOptions = {
      title: `${this.currentYear} ${this.currentMonthName} Expenses (Value)`,
      width:350,
      height:300,
      is3D: true,
      bars: 'horizontal',
      legend: {position: 'none'}
    }
  }

  private preparePaymentMethodCard() {
    const transactions = this.sessionData.expenses.filter(x => x.year === this.currentYear && x.month===this.currentMonthNumber).map(x => x.transactions_cp)[0];
    if (transactions && transactions.length > 0) {
      PAYMENT_METHODS.forEach(x => {
        const pmSum = transactions.filter(y => y.payment_method === x.value).reduce((acc, transaction) => acc + transaction.amount!, 0);
        this.paymentMethodWiseSum.push([x.viewValue, pmSum])
      })
    }
    this.paymentMethodWiseSumOptions = {
      title: `${this.currentYear} ${this.currentMonthName} Payment Method`,
      width:350,
      height:300,
      is3D: true,
      fontSize: 12,
      chartArea:{left:10,top:30,width:'100%',height:'90%'},
      legend: {position: 'right', textStyle: { fontSize: 10, alignment: 'center'}}
    }
  }

  private prepareMonthlyPaymentsCard() {
    const monthlyPayments = this.sessionData.payments.filter(x => x.year === this.currentYear && x.month===this.currentMonthNumber).map(x => x.transactions_cp)[0];
    if (monthlyPayments) {
      this.monthlyPayments = monthlyPayments.map(x => [x.alias ? x.alias : x.destination, x.amount])
    }
    this.monthlyPayments.unshift(['Month', 'Amount'])
    this.monthlyPaymentsOptions = {
      title: `${this.currentYear} ${this.currentMonthName} Payments`,
      width:350,
      height:300,
      is3D: true,
      fontSize: 12,
      chartArea:{left:10,top:30,width:'100%',height:'90%'},
      legend: {position: 'right', textStyle: { fontSize: 10, alignment: 'left'}}
    }
  }

  protected readonly faCaretUp = faCaretUp;
  protected readonly faLineChart = faLineChart;
  protected readonly faJpy = faJpy;
  protected readonly faMoneyBill = faMoneyBill;
  protected readonly faCaretDown = faCaretDown;
  protected readonly Math = Math;
}
