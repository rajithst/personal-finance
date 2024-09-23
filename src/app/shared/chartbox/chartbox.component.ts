import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  ViewChild,
} from '@angular/core';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { DropDownType } from '../../data/shared.data';
import {ChartData, ChartOptionSwitchEmit} from "../../model/dashboard";

declare var google: any;

@Component({
  selector: 'app-chartbox',
  templateUrl: './chartbox.component.html',
  styleUrl: './chartbox.component.css',
})
export class ChartboxComponent implements OnChanges {
  @Input() chartData: ChartData | null;
  @Output() onOptionChange: EventEmitter<ChartOptionSwitchEmit | null> =
    new EventEmitter<ChartOptionSwitchEmit | null>();
  @ViewChild('chartArea') chartArea: ElementRef;
  protected readonly faEllipsisV = faEllipsisV;

  chart: any = null;
  chartTitle: string;
  chartSwitches: DropDownType[] | null = null;

  ngOnChanges() {
    try{
      google.charts.load('current', { packages: ['corechart', 'bar', 'line'] });
      google.charts.setOnLoadCallback(this.drawChart);
    } catch(e) {
      console.error(e);
    }

  }

  drawChart = () => {
    if (!this.chartData) {
      return;
    }
    this.chartSwitches = this.chartData.chartSwitches;
    const plotData = this.chartData.data;
    const plotOptions = this.chartData.options;
    const plotType = this.chartData.chartType;

    const data = google.visualization.arrayToDataTable(plotData);
    //const options = this.chartOptions;
    this.chartTitle = plotOptions.title;
    plotOptions.title = '';
    if (this.chartArea) {
      if (plotType == 'bar') {
        this.chart = new google.charts.Bar(this.chartArea.nativeElement);
        plotOptions.vAxis = { format: 'decimal' };
        this.chart.draw(data, google.charts.Bar.convertOptions(plotOptions));
      } else if (plotType == 'pie') {
        if (!('chartArea' in plotOptions)) {
          plotOptions.chartArea = {
            left: 10,
            top: 50,
            width: '100%',
            height: '70%',
          };
        }
        plotOptions.tooltip = { ignoreBounds: true };
        this.chart = new google.visualization.PieChart(
          this.chartArea.nativeElement,
        );
        this.chart.draw(data, plotOptions);
      } else if (plotType == 'line') {
        this.chart = new google.visualization.ComboChart(
          this.chartArea.nativeElement,
        );
        this.chart.draw(data, plotOptions);
      }
    } else {
      this.chart = '';
    }
  };

  switchOption(data: DropDownType) {
    const payload: ChartOptionSwitchEmit = {
      chartKey: this.chartData?.chartKey!,
      chartSwitch: data
    }
    this.onOptionChange.emit(payload);
  }
}
