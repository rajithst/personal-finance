import { Injectable } from '@angular/core';
import { MONTHS } from '../../shared/data/client.data';
import {PortfolioService} from "./portfolio.service";

@Injectable()
export class ChartUtilityService {
  currentYear = new Date().getFullYear();
  currentMonthNumber = new Date().getMonth();
  lastMonthNumber = new Date().getMonth() - 1;
  currentMonthKey = `${this.currentYear}-${String(this.currentMonthNumber).padStart(2, '0')}-01`;

  constructor(private readonly portfolioService: PortfolioService) {}

  getTotalInvestments(): number {
    return this.portfolioService.portfolioData()?.total_investment ?? 0;
  }

  getPortfolioValue(): number {
    return this.portfolioService.portfolioData()?.current_portfolio_value ?? 0;
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
