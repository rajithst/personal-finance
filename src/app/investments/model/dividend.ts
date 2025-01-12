export interface MonthlyDividend {
  year: number;
  month: number;
  month_text: string;
  total: number;
  currency: string;
  dividends: DividendIncome[]
}


export interface DividendIncome {
  id: number;
  amount: number | null;
  quantity: number | null;
  company: number | null;
  company_name: string | null;
  image: string | null;
  industry: string | null;
  sector: string | null;
  year: number | null;
  month: number | null;
  month_text: string | null;
  payment_date: string | null ;
  ex_dividend_date: string | null;
  payment_received: boolean | null;
  pre_tax_amount: number | null;
  tax_rate: number | null;
  stock_currency: string | null;
  notes: string | null;
  portfolio: number | null;
}
