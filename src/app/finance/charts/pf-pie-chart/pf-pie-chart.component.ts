import {Component, Input} from '@angular/core';
import {BarChartOptions} from "../options/chart_options";

@Component({
  selector: 'app-pf-pie-chart',
  templateUrl: './pf-pie-chart.component.html',
  styleUrl: './pf-pie-chart.component.css'
})
export class PfPieChartComponent {

  @Input() data!: any[];
  @Input() options!: BarChartOptions;

  view: [number, number] = [600, 300];
  showLabels: boolean = true;
  gradient = true;
  showLegend: boolean = true;
  chartData: any[] = [];

  ngOnChanges() {
    this.chartData = this.data;
  }
}
