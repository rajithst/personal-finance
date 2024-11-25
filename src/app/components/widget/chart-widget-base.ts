import { Component, input, OnInit } from '@angular/core';
import { ChartComponent, ChartConfig } from './chartbox.component';

@Component({
  selector: 'app-chart-widget',
  standalone: true,
  template: ` <app-chart [chartConfig]="chartConfig"></app-chart> `,
  styles: ``,
  imports: [ChartComponent],
})
export class ChartWidgetBase implements OnInit {
  chartType = input.required<string>();
  labels = input.required<string[]>();
  datasets = input.required<any[]>();
  plugins = input<any>({});
  options = input<any>({});
  chartConfig: ChartConfig = {
    type: '',
    data: {},
    plugins: {},
    options: {},
  };

  ngOnInit() {
    console.log(this.options());
    this.chartConfig = {
      type: this.chartType(),
      data: { labels: this.labels(), datasets: this.datasets() },
      plugins: this.plugins(),
      options: this.options(),
    };
  }
}
