import { Component, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { SummaryComponent } from '../../../components/widget/summarybox.component';
import { ChartUtilityService } from '../chart-utils.service';

@Component({
  selector: 'app-total-income',
  standalone: true,
  providers: [DecimalPipe, ChartUtilityService],
  imports: [SummaryComponent],
  template: `<app-summary [summaryValue]="formattedValue"></app-summary>`,
  styles: ``,
})
export class TotalIncomeWidget {
  chartUtilityService = inject(ChartUtilityService);
  decimalPipe = inject(DecimalPipe);
  formattedValue = `¥ ${this.decimalPipe.transform(this.chartUtilityService.getTotalAnnualIncome(), '1.2-2')}`;
}

@Component({
  selector: 'app-total-expense',
  standalone: true,
  providers: [DecimalPipe, ChartUtilityService],
  imports: [SummaryComponent],
  template: `<app-summary
    [summaryValue]="formattedValue"
    [summarySubValue]="formattedDiff"
    [summarySubText]="summarySubText"
    [iconText]="iconText"
    [iconColor]="iconColor"
    [subValueColor]="iconColor"
  ></app-summary>`,
  styles: ``,
})
export class TotalExpenseWidget {
  chartUtilityService = inject(ChartUtilityService);
  decimalPipe = inject(DecimalPipe);

  formattedValue = `¥ ${this.decimalPipe.transform(this.chartUtilityService.getTotalAnnualExpense(), '1.2-2')}`;
  diff = this.chartUtilityService.getLastAndCurrentMonthExpenseDiff();
  formattedDiff = `¥ ${this.decimalPipe.transform(this.diff, '1.2-2')}`;
  summarySubText = this.diff > 0 ? 'than last month' : 'less than last month';
  iconText = this.diff > 0 ? 'arrow_circle_up' : 'arrow_circle_down';
  iconColor = this.diff > 0 ? 'red' : 'green';
}

@Component({
  selector: 'app-total-payments',
  standalone: true,
  providers: [DecimalPipe, ChartUtilityService],
  imports: [SummaryComponent],
  template: `<app-summary
    [summaryValue]="formattedValue"
    [summarySubValue]="formattedDiff"
    [summarySubText]="summarySubText"
    [iconText]="iconText"
    [iconColor]="iconColor"
    [subValueColor]="iconColor"
  ></app-summary>`,
  styles: ``,
})
export class TotalPaymentsWidget {
  chartUtilityService = inject(ChartUtilityService);
  decimalPipe = inject(DecimalPipe);

  formattedValue = `¥ ${this.decimalPipe.transform(this.chartUtilityService.getTotalAnnualPayments(), '1.2-2')}`;
  diff = this.chartUtilityService.getLastAndCurrentMonthPaymentDiff();
  formattedDiff = `¥ ${this.decimalPipe.transform(this.diff, '1.2-2')}`;

  summarySubText = this.diff > 0 ? 'than last month' : 'less than last month';
  iconText = this.diff > 0 ? 'arrow_circle_up' : 'arrow_circle_down';
  iconColor = this.diff > 0 ? 'red' : 'green';
}

@Component({
  selector: 'app-total-savings',
  standalone: true,
  providers: [DecimalPipe],
  imports: [SummaryComponent],
  template: `<app-summary
    [summaryValue]="formattedValue"
    [summarySubValue]="formattedDiff"
    [summarySubText]="summarySubText"
    [iconText]="iconText"
    [iconColor]="iconColor"
    [subValueColor]="iconColor"
  ></app-summary>`,
  styles: ``,
})
export class TotalSavingsWidget {
  chartUtilityService = inject(ChartUtilityService);
  decimalPipe = inject(DecimalPipe);

  formattedValue = `¥ ${this.decimalPipe.transform(this.chartUtilityService.getTotalAnnualSavings(), '1.2-2')}`;
  diff = this.chartUtilityService.getLastAndCurrentMonthSavingsDiff();
  formattedDiff = `¥ ${this.decimalPipe.transform(this.diff, '1.2-2')}`;
  summarySubText = this.diff > 0 ? 'than last month' : 'less than last month';
  iconText = this.diff > 0 ? 'arrow_circle_up' : 'arrow_circle_down';
  iconColor = this.diff > 0 ? 'green' : 'red';
}
