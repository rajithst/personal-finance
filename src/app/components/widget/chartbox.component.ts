import { Component, ElementRef, input, OnInit, viewChild } from '@angular/core';
import Chart, { ChartTypeRegistry } from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
//Chart.register(ChartDataLabels);
export interface ChartConfig {
  type: string;
  data: any;
  plugins: any;
  options: any;
  datalabels: any;
}
@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [],
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
    console.log(this.chartConfig().plugins);
    const chart = new Chart(this.chart().nativeElement, {
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
        },
        plugins: {
          ...this.chartConfig().plugins,


        },
        onClick: (evt: Event) => {
          var elements = chart.getElementsAtEventForMode(
            evt,
            'index',
            { intersect: true },
            false,
          );
          var index = elements[0].index;
          console.log(elements, index);
        },
      },
    });
  }
}
