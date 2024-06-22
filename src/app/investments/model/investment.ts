

export interface InvestmentResponse {
  holdings: any[];
  dividends: any;
  transactions: any[];
  companies: any[];
}

export interface CompanyInfo {
  symbol: string;
  company_name: string;
  sector: string;
  industry: string;
  exchange: string;
  currency: string;
  country: string;
  website: string;
  image: string;
  description: string;
  created_at: string;
  modified_at: string;
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
