import { Component, OnInit } from '@angular/core';
import { MonthlyTransaction } from '../model/transactions';
import { DropDownType, TRANSACTION_CATEGORIES } from '../../data/client.data';
import { BarChartOptions } from '../charts/options/chart_options';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SessionService } from '../service/session.service';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.css',
})
export class AnalyticsComponent implements OnInit {
  private sessionData = this.sessionService.getData();
  constructor(
    private dialog: MatDialog,
    private router: Router,
    private sessionService: SessionService,
  ) {}

  barChartData: any[] = [];
  pieChartData: any[] = [];
  transactionData: MonthlyTransaction[] = [];
  filterCategories: DropDownType[] = TRANSACTION_CATEGORIES;
  barChartOptionsMonthly: BarChartOptions = {
    type: 'vertical',
    xAxisLabel: 'Months',
    yAxisLabel: 'Amount',
  };
  barChartOptionsCategory: BarChartOptions = {
    type: 'horizontal',
    xAxisLabel: 'Amount',
    yAxisLabel: 'Category',
  };
  targetCategory: number = 1;
  ngOnInit(): void {
    this.transactionData = this.sessionData.expenses;
    this.barChartData = this.transactionData.map((x) => ({
      name: x.month_text,
      value: x.total,
    }));
    this.pieChartData = this.getSumByCategory(this.transactionData);
  }

  private getSumByCategory(transactions: MonthlyTransaction[]) {
    const categorySums: { [category: string]: number } = {};

    this.filterCategories.forEach((category) => {
      categorySums[category.viewValue] = 0;
    });

    transactions.forEach((data) => {
      data.transactions_cp.forEach((x) => {
        const category =
          this.targetCategory == 1 ? x.category_text! : x.subcategory_text!;
        const amount = x.amount;
        if (categorySums.hasOwnProperty(category)) {
          categorySums[category] += amount;
        }
      });
    });
    const sumByCatehory: any[] = [];
    for (const [key, value] of Object.entries(categorySums)) {
      sumByCatehory.push({ name: key, value: value });
    }
    return sumByCatehory;
  }


}
