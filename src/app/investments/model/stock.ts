export interface Stock {
  symbol: string;
  company_name: string;
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

export interface StockPriceHistory {
  id: number;
  date: string;
  current_price: number;
  change: number;
  change_percentage: number;
  day_high_price: number;
  day_low_price: number;
  company: string;
  company_name: string;
  industry: string;
  sector: string;
  image: string;
}

export interface StockPurchaseRequest {
  task: string;
  id: number | null;
  company: string;
  purchase_date: string;
  quantity: number | null;
  purchase_price: number | null;
  settlement_currency: string | null;
  exchange_rate: number | null;
  stock_currency: string;
  notes: string;
}
