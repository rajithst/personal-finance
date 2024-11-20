import { Component, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [DecimalPipe, MatIcon],
  template: `
    <div class="total-summary">
      <p class="statistics" [style.color]="color() ?? 'inherit'">
        {{ summaryValue() }}
      </p>
      @if (iconText()) {
        <mat-icon [style.color]="iconColor() ?? 'inherit'">{{
          iconText()
        }}</mat-icon>
      }
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
    .statistics {
      margin-right: 5px;
    }
    .stat-sub-text {
      margin-top: -15px;
      text-align: center;
      font-size: 12px;
    }
  `,
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
