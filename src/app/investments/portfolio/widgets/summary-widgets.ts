import { Component, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { SummaryComponent } from '../../../components/widget/summarybox.component';
import { ChartUtilityService } from '../chart-utils.service';

@Component({
  selector: 'app-total-investment',
  standalone: true,
  providers: [DecimalPipe, ChartUtilityService],
  imports: [SummaryComponent],
  template: `<app-summary [summaryValue]="formattedValue"></app-summary>`,
  styles: ``,
})
export class TotalInvestmentWidget {
  chartUtilityService = inject(ChartUtilityService);
  decimalPipe = inject(DecimalPipe);
  formattedValue = `¥ ${this.decimalPipe.transform(10000, '1.2-2')}`;
}
