
import {Holding} from "./investment";

export interface StockPurchase {
  id: number | null;
  company_id: string;
  purchase_date: string;
  quantity: number;
  purchase_price: number;
  settlement_currency: string | null;
  exchange_rate: number | null;
  stock_currency: string,
  notes: string | null;
}

export interface StockPurchaseResponse {
  holding: Holding;
}
