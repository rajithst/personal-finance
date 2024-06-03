import {AfterViewInit, Component, ElementRef, Input, ViewChild} from '@angular/core';
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
  @ViewChild('chartArea') chartArea: ElementRef;

  chart: any;
  chartTitle: string;

  ngAfterViewInit() {
    google.charts.load('current', { 'packages': ['corechart', 'bar'] });
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
    if (this.chartType == 'bar') {
      this.chart = new google.charts.Bar(this.chartArea.nativeElement)
      this.chart.draw(data, google.charts.Bar.convertOptions(options));
    } else if (this.chartType == 'pie') {
      this.chart = new google.visualization.PieChart(this.chartArea.nativeElement);
      this.chart.draw(data, options);
    }

  }
  protected readonly faEllipsisV = faEllipsisV;
}
