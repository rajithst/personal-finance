export interface Portfolio {
  id: number;
  name: string;
  description?: string;
  currency?: string;
}
export interface PortfolioPerformance {
  total_investment: number;
  current_portfolio_value: number;
  total_profit: number;
  monthly_investment: DateValueMap;
  sector_allocation: CategoryAllocation[];
  industry_allocation: CategoryAllocation[];
}

export interface DateValueMap {
  [key: string]: number;
}

export interface CategoryAllocation {
  [key: string]: number;
}
