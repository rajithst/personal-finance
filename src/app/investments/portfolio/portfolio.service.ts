import { Injectable, signal } from '@angular/core';
import { PortfolioPerformance } from '../model/portfolio';
@Injectable()
export class PortfolioService {
  portfolioData = signal<PortfolioPerformance | null>(null);

  setPortfolioData(data: PortfolioPerformance) {
    this.portfolioData.set(data);
  }
}
