import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {MonthlyTransaction} from "../../../shared/interface/transactions";
import {BarChartOptions} from "../options/chart_options";


@Component({
  selector: 'app-pf-bar-chart',
  templateUrl: './pf-bar-chart.component.html',
  styleUrl: './pf-bar-chart.component.css',
})
export class PfBarChartComponent implements OnChanges {
  @Input() data!: any[];
  @Input() options!: BarChartOptions;

  view: [number, number] = [600, 400];
  showXAxis = true;
  showYAxis = true;
  gradient = true;
  showLegend = false;
  showXAxisLabel = true;
  xAxisLabel = '';
  showYAxisLabel = true;
  yAxisLabel = '';
  chartData: any[] = [];

  ngOnChanges() {
    this.chartData = this.data;
    this.xAxisLabel = this.options.xAxisLabel;
    this.yAxisLabel = this.options.yAxisLabel;
  }
  onSelect(event: any) {
    console.log(event);
  }
}
