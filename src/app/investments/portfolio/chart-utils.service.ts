import {inject, Injectable} from '@angular/core';
import {PortfolioService} from "./portfolio.service";
import {InvestmentStore} from "../../core/store/investment.store";

@Injectable()
export class ChartUtilityService {
  private readonly portfolioService = inject(PortfolioService);
  private readonly store = inject(InvestmentStore);

  getTotalInvestments(): number {
    return this.portfolioService.portfolioData()?.total_investment ?? 0;
  }

  getPortfolioValue(): number {
    return this.portfolioService.portfolioData()?.current_portfolio_value ?? 0;
  }

  getTotalProfit() {
    return this.getPortfolioValue() - this.getTotalInvestments();
  }

  getPassiveIncome() {
    return this.portfolioService.portfolioData()?.passive_income ?? 0;
  }

  getCurrentPortfolioCurrency() {
    const portfolio = this.store.currentPortfolio();
    if (portfolio?.currency === 'USD') {
      return '$';
    } else if (portfolio?.currency === 'JPY') {
      return '¥';
    }
    return '';
  }

}
