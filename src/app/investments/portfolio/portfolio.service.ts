import { Injectable, signal } from '@angular/core';
import {PortfolioResponse} from "../model/portfolio";

@Injectable()
export class PortfolioService {
  portfolioData = signal<PortfolioResponse | null>(null);

  setPortfolioData(data: PortfolioResponse) {
    this.portfolioData.set(data);
  }
}
