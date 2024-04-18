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

  view: [number, number] = [600, 400];
  showLabels: boolean = true;
  gradient = true;
  showLegend: boolean = false;
  chartData: any[] = [];

  ngOnChanges() {
    this.chartData = this.data;
  }
}
