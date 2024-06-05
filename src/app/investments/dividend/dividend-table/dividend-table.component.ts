import {Component, Input} from '@angular/core';
import {
  faCaretDown,
  faCaretUp,
  faCircleCheck,
  faJpy,
  faLineChart,
  faMoneyBill
} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-dividend-table',
  templateUrl: './dividend-table.component.html',
  styleUrl: './dividend-table.component.css'
})
export class DividendTableComponent {

  @Input() dividends: any[] = []

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'action'];
  protected readonly faCaretUp = faCaretUp;
  protected readonly faMoneyBill = faMoneyBill;
  protected readonly faLineChart = faLineChart;
  protected readonly faJpy = faJpy;
  protected readonly faCaretDown = faCaretDown;
  protected readonly Math = Math;
  protected readonly faCircleCheck = faCircleCheck;

  dividendPaymentFlow(element: any) {

  }
}
