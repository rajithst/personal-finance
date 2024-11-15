import { Component, ElementRef, input, OnInit, viewChild } from '@angular/core';
import Chart, { ChartTypeRegistry } from 'chart.js/auto';
import { DecimalPipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

export interface ChartConfig {
  type: string;
  data: any;
  options: any;
}
@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [DecimalPipe, MatIcon],
  template: `
    <div class="total-summary">
      <p class="statistics" [style.color]="color() ?? 'inherit'">
        {{ summaryValue() }}
      </p>
      @if (icon() && icon() == 'up') {
        <mat-icon class="up-style">arrow_circle_up</mat-icon>
      }
      @if (icon() && icon() == 'down') {
        <mat-icon class="down-style">arrow_circle_down</mat-icon>
      }
    </div>

    <div class="stat-sub-text">
      @if (summarySubValue()) {
        <span>{{ summarySubValue() }}</span>
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
    .up-style {
      color: green;
    }
    .down-style {
      color: red;
    }
  `,
})
export class SummaryComponent {
  summaryValue = input.required<number | string>();
  summarySubText = input<string>();
  summarySubValue = input<string>();
  icon = input<string>();
  color = input<string>();
}
