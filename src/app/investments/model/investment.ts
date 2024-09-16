export interface InvestmentResponse {
  holdings: any[];
  dividends: any;
  transactions: any[];
}

export interface StockDailyPriceResponse {
  symbol: string;
  prices: StockDailyPrice[];
}

export interface StockDailyPrice {
  id: number;
  date: string;
  day_high_price: number;
  day_low_price: number;
  current_price: number;
  change: number;
  change_percentage: number;
  company_id: string;
}

export interface CompanyInfo {
  symbol: string;
  company_name: string;
  sector: string;
  industry: string;
  exchange: string;
  stock_currency: string;
  currency: string;
  country: string;
  website: string;
  image: string;
  description: string;
}

export interface CompanyResponse {
  companies: CompanyInfo[];
}

export interface StockPurchaseHistory {
  id: number;
  purchase_date: string;
  year: number;
  month: number;
  quantity: number;
  purchase_price: number;
  stock_currency: string;
  exchange_rate: number;
  company: string;
  company_name: string;
  industry: string;
  sector: string;
  image: string;
}

export interface Holding {
  id: number;
  quantity: number;
  average_price: number;
  current_price: number;
  total_investment: number;
  current_value: number;
  stock_currency: string;
  industry: string;
  sector: string;
  profit_loss: number;
  price_updated_at: string; // Assuming this is in ISO 8601 date format ("yyyy-MM-dd")
  profit_change_percentage: number;
  company: string;
  company_name: string;
  image: string;
}
