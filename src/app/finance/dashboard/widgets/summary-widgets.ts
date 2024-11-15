import {Component, inject} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {DecimalPipe} from "@angular/common";
import {DashboardService} from "../../../service/dashboard.service";
import {SummaryComponent} from "../../../components/widget/summarybox.component";

@Component({
  selector: 'app-total-income',
  standalone: true,
  providers: [DecimalPipe],
  imports: [SummaryComponent],
  template: `<app-summary
    [summaryValue]="'¥ '+totalIncomeText"
  ></app-summary>`,
  styles: ``,
})
export class TotalIncomeWidget {
  today = new Date();
  currentYear = this.today.getFullYear();
  dashboardService = inject(DashboardService);
  decimalPipe = inject(DecimalPipe);
  totalIncome: number = this.dashboardService.dashboardData()?.income
    .filter((x) => x.year === this.currentYear)
    .map((x) => x.amount)
    .reduce((a, b) => a + b, 0) || 0;
  totalIncomeText = this.decimalPipe.transform(this.totalIncome, '1.2-2') || '';

}

@Component({
  selector: 'app-total-expense',
  standalone: true,
  providers: [DecimalPipe],
  imports: [SummaryComponent],
  template: `<app-summary
    [summaryValue]="'¥ '+totalExpenseText"
  ></app-summary>`,
  styles: ``,
})
export class TotalExpenseWidget {
  today = new Date();
  currentYear = this.today.getFullYear();
  dashboardService = inject(DashboardService);
  decimalPipe = inject(DecimalPipe);
  totalSavings = this.dashboardService.dashboardData()?.saving
    .filter((x) => x.year === this.currentYear)
    .map((x) => x.amount)
    .reduce((a, b) => a + b, 0) ?? 0;
  expenses = this.dashboardService.dashboardData()?.expense
    .filter((x) => x.year === this.currentYear)
    .map((x) => x.amount)
    .reduce((a, b) => a + b, 0) ?? 0;
  totalExpenses = this.expenses - this.totalSavings;
  totalExpenseText = this.decimalPipe.transform(this.totalExpenses, '1.2-2') || '';

}

@Component({
  selector: 'app-total-payments',
  standalone: true,
  providers: [DecimalPipe],
  imports: [SummaryComponent],
  template: `<app-summary
    [summaryValue]="'¥ '+totalPaymentText"
  ></app-summary>`,
  styles:  ``
})
export class TotalPaymentsWidget {
  today = new Date();
  currentYear = this.today.getFullYear();
  dashboardService = inject(DashboardService);
  decimalPipe = inject(DecimalPipe);
  totalPayments = this.dashboardService.dashboardData()?.payment
    .filter((x) => x.year === this.currentYear)
    .map((x) => x.amount)
    .reduce((a, b) => a + b, 0) ?? 0;
  totalPaymentText = this.decimalPipe.transform(this.totalPayments, '1.2-2') || '';
}

@Component({
  selector: 'app-total-savings',
  standalone: true,
  providers: [DecimalPipe],
  imports: [SummaryComponent],
  template: `<app-summary
    [summaryValue]="'¥ '+totalSavingsText"
    [icon]="icon"
  ></app-summary>`,
  styles:  ``
})
export class TotalSavingsWidget {
  today = new Date();
  currentYear = this.today.getFullYear();
  dashboardService = inject(DashboardService);
  decimalPipe = inject(DecimalPipe);
  totalSavings = this.dashboardService.dashboardData()?.saving
    .filter((x) => x.year === this.currentYear)
    .map((x) => x.amount)
    .reduce((a, b) => a + b, 0) ?? 0;
  totalSavingsText = this.decimalPipe.transform(this.totalSavings, '1.2-2') || '';
  icon = this.totalSavings ? 'up' : 'down';
}
