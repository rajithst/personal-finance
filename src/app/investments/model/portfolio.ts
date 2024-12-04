export interface Portfolio {
  id: number;
  name: string;
  description?: string;
  currency?: string;
}
export interface PortfolioPerformanceResponse {
  portfolios: Portfolio;
}
