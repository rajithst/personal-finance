import { Component, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
    selector: 'app-summary',
    imports: [MatIcon],
    template: `
    <div class="total-summary">
      <div class="summary-content">
        <div class="statistics" [style.color]="color() ?? 'inherit'">
          {{ summaryValue() }}
        </div>
        @if (iconText()) {
          <div>
            <mat-icon [style.color]="iconColor() ?? 'inherit'">{{
              iconText()
            }}</mat-icon>
          </div>
        }
      </div>
    </div>

    <div class="stat-sub-text">
      @if (summarySubValue()) {
        <span [style.color]="subValueColor() ?? 'inherit'">{{
          summarySubValue()
        }}</span>
      }
      @if (summarySubText()) {
        {{ summarySubText() }}
      }
    </div>
  `,
    styles: `
    .total-summary {
      display: flex;
      justify-content: center;
      margin-top: -8px;
      margin-bottom: 8px;
    }
    .summary-content {
      margin: 3% 0;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .statistics {
      margin-right: 5px;
    }
    .stat-sub-text {
      margin-top: -15px;
      text-align: center;
      font-size: 12px;
    }
  `
})
export class SummaryComponent {
  summaryValue = input.required<number | string>();
  summarySubText = input<string>();
  summarySubValue = input<string>();
  iconColor = input<string>();
  iconText = input<string>();
  color = input<string>();
  subValueColor = input<string>();
}
