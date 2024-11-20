import {Component, ElementRef, input, OnInit, viewChild} from "@angular/core";
import Chart, {ChartTypeRegistry} from "chart.js/auto";

export interface ChartConfig {
  type: string;
  data: any
  options: any
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
      height: 95%;
      width: 100%;
    }
  `,
})
export class ChartComponent implements OnInit {
  chartConfig = input.required<ChartConfig>();
  chart = viewChild.required<ElementRef>('chart');

  ngOnInit() {
    console.log(this.chartConfig().data);
    new Chart(this.chart().nativeElement, {
      type: this.chartConfig().type as keyof ChartTypeRegistry,
      data: this.chartConfig().data,
      options: {
        maintainAspectRatio: true,
        responsive: true,
        elements: {
          line: {
            tension: 0.4
          }
        },
        plugins: this.chartConfig().options
      },
    })
  }
}
