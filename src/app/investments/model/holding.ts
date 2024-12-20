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
  price_updated_at: string;
  profit_change_percentage: number;
  company: string;
  company_name: string;
  image: string;
}
