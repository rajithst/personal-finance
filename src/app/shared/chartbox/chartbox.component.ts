import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild
} from '@angular/core';
import {faEllipsisV} from "@fortawesome/free-solid-svg-icons";
declare var google: any;

@Component({
  selector: 'app-chartbox',
  templateUrl: './chartbox.component.html',
  styleUrl: './chartbox.component.css'
})
export class ChartboxComponent implements AfterViewInit {

  @Input() chartType: string = '';
  @Input() chartData: any = [];
  @Input() chartOptions: any = {};
  @Output() rendered: EventEmitter<void> = new EventEmitter<void>()
  @ViewChild('chartArea') chartArea: ElementRef;
  protected readonly faEllipsisV = faEllipsisV;

  chart: any = null;
  chartTitle: string;

  ngAfterViewInit() {
    google.charts.load('current', { 'packages': ['corechart', 'bar', 'line'] });
    google.charts.setOnLoadCallback(this.drawChart);
  }

  drawChart = () => {
    if (this.chartData.length < 2) {
      this.chartData.push(['', 0])
    }
    const data = google.visualization.arrayToDataTable(this.chartData);
    const options = this.chartOptions;
    this.chartTitle = options.title;
    options.title = '';
    if (this.chartArea) {
      if (this.chartType == 'bar') {
        this.chart = new google.charts.Bar(this.chartArea.nativeElement)
        options.vAxis = { format: 'decimal' }
        this.chart.draw(data, google.charts.Bar.convertOptions(options));
      } else if (this.chartType == 'pie') {
        if (!('chartArea' in options)) {
          options.chartArea = { left: 10, top: 50, width: '100%', height: '70%' }
        }
        options.tooltip = { ignoreBounds: true }
        this.chart = new google.visualization.PieChart(this.chartArea.nativeElement);
        this.chart.draw(data, options);
      } else if (this.chartType == 'line') {
        this.chart = new google.visualization.ComboChart(this.chartArea.nativeElement);
        this.chart.draw(data, options);
      }
    } else {
      this.chart = '';
    }

    this.rendered.emit()
  }

}
