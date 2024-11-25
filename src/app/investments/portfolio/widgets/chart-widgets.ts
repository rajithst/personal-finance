import {Component, inject, OnInit} from "@angular/core";
import {ChartWidgetBase} from "../../../components/widget/chart-widget-base";
import {ChartUtilityService} from "../chart-utils.service";

@Component({
  selector: 'app-monthly-investments',
  standalone: true,
  template: `
    <app-chart-widget
      [chartType]="'doughnut'"
      [labels]="labels"
      [datasets]="datasets"
    ></app-chart-widget>
  `,
  imports: [ChartWidgetBase],
  providers: [ChartUtilityService]
})
export class PortfolioAllocationWidget implements OnInit {
  chartUtility = inject(ChartUtilityService);
  datasets: any[] = [];
  labels: string[] = [];
  ngOnInit() {}
}
