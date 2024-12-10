import { Injectable, signal } from '@angular/core';
import { PortfolioPerformanceResponse } from '../model/portfolio';
@Injectable()
export class PortfolioService {
  portfolioData = signal<PortfolioPerformanceResponse | null>(null);

  setPortfolioData(data: PortfolioPerformanceResponse) {
    this.portfolioData.set(data);
  }
}
