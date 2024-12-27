import { Component, ElementRef, input, OnInit, viewChild } from '@angular/core';
import Chart, { ChartTypeRegistry } from 'chart.js/auto';

export interface ChartConfig {
  type: string;
  data: any;
  plugins: any;
  options: any;
  datalabels: any;
}
@Component({
  selector: 'app-chart',
  template: `
    <div class="chart-container">
      <canvas #chart></canvas>
    </div>
  `,
  styles: `
    .chart-container {
      display: inline-block;
      position: relative;
      height: 95%;
      width: 100%;
    }
  `,
})
export class ChartComponent implements OnInit {
  chartConfig = input.required<ChartConfig>();
  chart = viewChild.required<ElementRef>('chart');

  ngOnInit() {
    new Chart(this.chart().nativeElement, {
      type: this.chartConfig().type as keyof ChartTypeRegistry,
      data: this.chartConfig().data,
      options: {
        ...this.chartConfig().options,
        maintainAspectRatio: true,
        responsive: true,
        elements: {
          line: {
            tension: 0.4,
          },
          point: {
            radius: 0,
          },
        },
        plugins: {
          ...this.chartConfig().plugins,
        },
      },
    });
  }
}
