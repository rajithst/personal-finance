import { Injectable } from '@angular/core';
import { Portfolio, PortfolioPerformanceResponse } from '../model/portfolio';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PortfolioService {
  private readonly portfolioPerformance$ =
    new BehaviorSubject<PortfolioPerformanceResponse | null>(null);
  private readonly portfolioList$ = new BehaviorSubject<Portfolio[]>([]);
  portfolios = this.portfolioList$.asObservable();
  portfolioPerformance = this.portfolioPerformance$.asObservable();

  setPortfolios(list: Portfolio[]) {
    this.portfolioList$.next(list);
  }

  setPortfolioPerformance(performance: PortfolioPerformanceResponse) {
    this.portfolioPerformance$.next(performance);
  }
}
