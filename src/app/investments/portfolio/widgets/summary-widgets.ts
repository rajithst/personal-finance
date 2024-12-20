import { Component, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { SummaryComponent } from '../../../components/widget/summarybox.component';
import { ChartUtilityService } from '../chart-utils.service';

@Component({
    selector: 'app-portfolio-gains',
    providers: [DecimalPipe, ChartUtilityService],
    imports: [SummaryComponent],
    template: ` <app-summary
    [summaryValue]="formattedValue"
    [color]="color"
    [iconText]="iconText"
    [iconColor]="color"
    [summarySubValue]="totalProfitPercentage"
    [subValueColor]="color"
  >
  </app-summary>`,
    styles: ``
})
export class PortfolioGainsWidget {
  chartUtilityService = inject(ChartUtilityService);
  decimalPipe = inject(DecimalPipe);
  profitLoss = this.chartUtilityService.getTotalProfit();
  totalInvestments = this.chartUtilityService.getTotalInvestments();
  formattedValue = `$ ${this.decimalPipe.transform(this.profitLoss, '1.2-2')}`;
  color = getColor(this.profitLoss);
  iconText = getIcon(this.profitLoss);
  profitPercentage = (this.profitLoss / this.totalInvestments) * 100;
  totalProfitPercentage = `${this.profitPercentage > 0 ? '+' : '-'}${this.decimalPipe.transform(this.profitPercentage, '1.2-2')} %`;
}

@Component({
    selector: 'app-portfolio-value',
    providers: [DecimalPipe, ChartUtilityService],
    imports: [SummaryComponent],
    template: `<app-summary
    [summaryValue]="formattedValue"
    [summarySubText]="summarySubText"
  ></app-summary>`,
    styles: ``
})
export class PortfolioValueWidget {
  chartUtilityService = inject(ChartUtilityService);
  decimalPipe = inject(DecimalPipe);
  formattedValue = `$ ${this.decimalPipe.transform(this.chartUtilityService.getPortfolioValue(), '1.2-2')}`;
  investedValue = `$ ${this.decimalPipe.transform(this.chartUtilityService.getTotalInvestments(), '1.2-2')}`;
  summarySubText = `Invested value: ${this.investedValue}`;
}

function getIcon(value: number) {
  return value > 0 ? 'arrow_circle_up' : 'arrow_circle_down';
}

function getColor(value: number) {
  return value > 0 ? 'green' : 'red';
}
