import { Injectable, signal } from '@angular/core';
import { PortfolioPerformance } from '../model/portfolio';
@Injectable()
export class PortfolioService {
  portfolioData = signal<PortfolioPerformance | null>(null);
  loading = signal(true);

  setPortfolioData(data: PortfolioPerformance) {
    this.portfolioData.set(data);
  }

  setLoading(value: boolean) {
    this.loading.set(value);
  }
}
