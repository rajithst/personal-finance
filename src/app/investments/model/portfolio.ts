export interface Portfolio {
  id: number;
  name: string;
  description?: string;
  currency?: string;
}

export interface Growth {
  date: string;
  total_investment: number;
  portfolio_value: number;
  total_profit: number;
  daily_return: number;
}

export interface SectorPerformance {
  sector: string;
  total_investment: number;
  total_current_value: number;
  total_profit_loss: number;
}

export interface PortfolioPerformance {
  total_investment: number;
  current_portfolio_value: number;
  total_profit: number;
  monthly_investment: DateValueMap;
  sector_allocation: CategoryAllocation[];
  industry_allocation: CategoryAllocation[];
  sector_performance: SectorPerformance[];
  growth: Growth[];
}

export interface DateValueMap {
  [key: string]: number;
}

export interface CategoryAllocation {
  [key: string]: number;
}
