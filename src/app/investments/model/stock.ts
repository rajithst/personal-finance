export interface Stock {
  symbol: string;
  company_name: string;
}

export interface DividendIncome {
  total: number;
  year: number;
  month: number;
  month_text: string;
  dividends: Dividend[];
}
export interface Dividend {
  id: number;
  amount: number;
  quantity: number;
  company: string;
  company_name: string;
  image: string;
  industry: string;
  month: number;
  month_text: string;
  payment_date: string;
  payment_received: boolean;
  sector: string;
  stock_currency: string;
  year: number;
}
