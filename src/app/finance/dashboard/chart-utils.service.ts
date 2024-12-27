import { Injectable } from '@angular/core';
import { DashboardTransaction } from '../model/dashboard';
import { DashboardService } from './dashboard.service';
import {MONTHS} from "./dashboard.data";

@Injectable()
export class ChartUtilityService {
  currentYear = new Date().getFullYear();
  currentMonthNumber = new Date().getMonth();
  lastMonthNumber = new Date().getMonth() - 1;
  currentMonthKey = `${this.currentYear}-${String(this.currentMonthNumber).padStart(2, '0')}-01`;

  constructor(private readonly dashboardService: DashboardService) {}

  private filter(
    data: DashboardTransaction[] | null,
    year: number,
    month?: number,
  ): number {
    let filteredData = data?.filter((x) => x.year === year);
    if (filteredData && month !== undefined) {
      filteredData = filteredData.filter((x) => x.month === month);
    }
    return filteredData?.map((x) => x.amount).reduce((a, b) => a + b, 0) ?? 0;
  }

  getTotalAnnualIncome(): number {
    return this.filter(
      this.dashboardService.dashboardData()?.income ?? null,
      this.currentYear,
    );
  }

  getTotalAnnualPayments(): number {
    return this.filter(
      this.dashboardService.dashboardData()?.payment ?? null,
      this.currentYear,
    );
  }

  getTotalAnnualSavings(): number {
    return this.filter(
      this.dashboardService.dashboardData()?.saving ?? null,
      this.currentYear,
    );
  }

  getTotalAnnualExpense(): number {
    const expenses = this.filter(
      this.dashboardService.dashboardData()?.expense ?? null,
      this.currentYear,
    );
    const savings = this.getTotalAnnualSavings();
    return expenses - savings;
  }

  getLastAndCurrentMonthPaymentDiff(): number {
    const lastMonthPayment = this.filter(
      this.dashboardService.dashboardData()?.payment ?? null,
      this.currentYear,
      this.lastMonthNumber,
    );
    const currentMonthPayment = this.filter(
      this.dashboardService.dashboardData()?.payment ?? null,
      this.currentYear,
      this.currentMonthNumber,
    );
    return currentMonthPayment - lastMonthPayment;
  }

  getLastAndCurrentMonthSavingsDiff(): number {
    const lastMonthSavings = this.filter(
      this.dashboardService.dashboardData()?.saving ?? null,
      this.currentYear,
      this.lastMonthNumber,
    );
    const currentMonthSavings = this.filter(
      this.dashboardService.dashboardData()?.saving ?? null,
      this.currentYear,
      this.currentMonthNumber,
    );
    return currentMonthSavings - lastMonthSavings;
  }

  getLastAndCurrentMonthExpenseDiff(): number {
    const lastMonthExpense = this.filter(
      this.dashboardService.dashboardData()?.expense ?? null,
      this.currentYear,
      this.lastMonthNumber,
    );
    const currentMonthExpense = this.filter(
      this.dashboardService.dashboardData()?.expense ?? null,
      this.currentYear,
      this.currentMonthNumber,
    );
    return currentMonthExpense - lastMonthExpense;
  }

  prepareMonthlyDataset(dataSource: DashboardTransaction[]) {
    const dataset: any[] = [];
    MONTHS.forEach((month) => {
      const dataPoint = dataSource?.find((x) => x.month === month.value);
      dataset.push(dataPoint ? dataPoint.amount : 0);
    });
    return dataset;
  }

  getMonthList() {
    return MONTHS.map((month) => month.viewValue);
  }

  getCurrentMonth() {
    return (
      MONTHS.find((m) => m.value === this.currentMonthNumber)?.viewValue ?? ''
    );
  }

  getCurrentYear() {
    return this.currentYear.toString();
  }
}
