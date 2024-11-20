import { Component, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { DashboardService } from '../dashboard.service';
import { SummaryComponent } from '../../../components/widget/summarybox.component';
import { DashboardTransaction } from '../../model/dashboard';

@Component({
  selector: 'app-total-income',
  standalone: true,
  providers: [DecimalPipe],
  imports: [],
  template: ``,
  styles: ``,
})
export class BaseSummaryWidget {
  today = new Date();
  currentYear = this.today.getFullYear();
  currentMonthNumber = this.today.getMonth() - 1;
  lastMonthNumber = this.today.getMonth() - 2;
  dashboardService = inject(DashboardService);
  decimalPipe = inject(DecimalPipe);
  dashboardData = this.dashboardService.dashboardData();

  get totalAnnualIncomeText() {
    return (
      this.decimalPipe.transform(this.getTotalAnnualIncome(), '1.2-2') ?? ''
    );
  }
  get totalAnnualSavingsText() {
    return (
      this.decimalPipe.transform(this.getTotalAnnualSavings(), '1.2-2') ?? ''
    );
  }
  get totalAnnualPaymentText() {
    return (
      this.decimalPipe.transform(this.getTotalAnnualPayments(), '1.2-2') ?? ''
    );
  }
  get totalAnnualExpenseText() {
    return (
      this.decimalPipe.transform(this.getTotalAnnualExpense(), '1.2-2') ?? ''
    );
  }

  get paymentSubValue() {
    return this.getLastAndCurrentMonthPaymentDiff();
  }

  get savingsSubValue() {
    return this.getLastAndCurrentMonthSavingsDiff();
  }

  get expenseSubValue() {
    return this.getLastAndCurrentMonthExpenseDiff();
  }

  private filter(
    data: DashboardTransaction[] | null,
    year: number,
    month?: number,
  ) {
    let f1 = data?.filter((x) => x.year === year);
    if (f1 && month) {
      f1 = f1.filter((x) => x.month === month);
    }
    return f1?.map((x) => x.amount).reduce((a, b) => a + b, 0) ?? 0;
  }

  private getTotalAnnualIncome() {
    return this.filter(this.dashboardData?.income ?? null, this.currentYear);
  }

  private getTotalAnnualPayments() {
    return this.filter(this.dashboardData?.payment ?? null, this.currentYear);
  }

  private getTotalAnnualSavings() {
    return this.filter(this.dashboardData?.saving ?? null, this.currentYear);
  }

  private getTotalAnnualExpense() {
    const expenses = this.filter(
      this.dashboardData?.expense ?? null,
      this.currentYear,
    );
    const savings = this.getTotalAnnualSavings();
    return expenses - savings;
  }

  private getLastAndCurrentMonthPaymentDiff() {
    const currentMonthAmount = this.filter(
      this.dashboardData?.payment ?? null,
      this.currentYear,
      this.currentMonthNumber,
    );
    const lastMonthAmount = this.filter(
      this.dashboardData?.payment ?? null,
      this.currentYear,
      this.lastMonthNumber,
    );
    return currentMonthAmount - lastMonthAmount;
  }

  private getLastAndCurrentMonthExpenseDiff() {
    const currMonthTotalExpense = this.filter(
      this.dashboardData?.expense ?? null,
      this.currentYear,
      this.currentMonthNumber,
    );
    const currMonthSavings = this.filter(
      this.dashboardData?.saving ?? null,
      this.currentYear,
      this.currentMonthNumber,
    );
    const currMonthExpense = currMonthTotalExpense - currMonthSavings;

    const lastMonthTotalExpense = this.filter(
      this.dashboardData?.expense ?? null,
      this.currentYear,
      this.lastMonthNumber,
    );
    const lastMonthSavings = this.filter(
      this.dashboardData?.saving ?? null,
      this.currentYear,
      this.lastMonthNumber,
    );
    const lastMonthExpense = lastMonthTotalExpense - lastMonthSavings;
    return currMonthExpense - lastMonthExpense;
  }

  private getLastAndCurrentMonthSavingsDiff() {
    const currentMonthAmount = this.filter(
      this.dashboardData?.saving ?? null,
      this.currentYear,
      this.currentMonthNumber,
    );
    const lastMonthAmount = this.filter(
      this.dashboardData?.saving ?? null,
      this.currentYear,
      this.lastMonthNumber,
    );
    return currentMonthAmount - lastMonthAmount;
  }
}
@Component({
  selector: 'app-total-income',
  standalone: true,
  providers: [DecimalPipe],
  imports: [SummaryComponent],
  template: `<app-summary
    [summaryValue]="'¥ ' + totalAnnualIncomeText"
  ></app-summary>`,
  styles: ``,
})
export class TotalIncomeWidget extends BaseSummaryWidget {}

@Component({
  selector: 'app-total-expense',
  standalone: true,
  providers: [DecimalPipe],
  imports: [SummaryComponent],
  template: `<app-summary
    [summaryValue]="'¥ ' + totalAnnualExpenseText"
    [summarySubValue]="formattedSubValue"
    [summarySubText]="summarySubText"
    [iconText]="iconText"
    [iconColor]="iconColor"
    [subValueColor]="iconColor"
  ></app-summary>`,
  styles: ``,
})
export class TotalExpenseWidget extends BaseSummaryWidget {
  formattedSubValue = '+ ¥ ' + this.decimalPipe.transform(this.expenseSubValue);
  summarySubText =
    this.expenseSubValue > 0 ? 'than last month' : 'less than last month';
  iconText = this.expenseSubValue > 0 ? 'arrow_circle_up' : 'arrow_circle_down';
  iconColor = this.expenseSubValue > 0 ? 'red' : 'green';

}

@Component({
  selector: 'app-total-payments',
  standalone: true,
  providers: [DecimalPipe],
  imports: [SummaryComponent],
  template: `<app-summary
    [summaryValue]="'¥ ' + totalAnnualPaymentText"
    [summarySubValue]="formattedSubValue"
    [summarySubText]="summarySubText"
    [iconText]="iconText"
    [iconColor]="iconColor"
    [subValueColor]="iconColor"
  ></app-summary>`,
  styles: ``,
})
export class TotalPaymentsWidget extends BaseSummaryWidget {
  formattedSubValue = '+ ¥ ' + this.decimalPipe.transform(this.paymentSubValue);
  summarySubText =
    this.paymentSubValue > 0 ? 'than last month' : 'less than last month';
  iconText = this.paymentSubValue > 0 ? 'arrow_circle_up' : 'arrow_circle_down';
  iconColor = this.paymentSubValue > 0 ? 'red' : 'green';
}

@Component({
  selector: 'app-total-savings',
  standalone: true,
  providers: [DecimalPipe],
  imports: [SummaryComponent],
  template: `<app-summary
    [summaryValue]="'¥ ' + totalAnnualSavingsText"
    [summarySubValue]="formattedSubValue"
    [summarySubText]="summarySubText"
    [iconText]="iconText"
    [iconColor]="iconColor"
    [subValueColor]="iconColor"
  ></app-summary>`,
  styles: ``,
})
export class TotalSavingsWidget extends BaseSummaryWidget {
  formattedSubValue = '+ ¥ ' + this.decimalPipe.transform(this.savingsSubValue);
  summarySubText =
    this.savingsSubValue > 0 ? 'than last month' : 'less than last month';
  iconText = this.savingsSubValue > 0 ? 'arrow_circle_up' : 'arrow_circle_down';
  iconColor = this.savingsSubValue > 0 ? 'green' : 'red';
}
