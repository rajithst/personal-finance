
export interface StockPurchase {
  id: number | null;
  company: string;
  purchase_date: string;
  quantity: number;
  purchase_price: number;
  notes: string | null;
}
