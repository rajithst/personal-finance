import { TransactionExpand } from './transactions';

export interface Payee {
  id: number;
  destination: string;
  destination_original: string;
  destination_eng: string;
  category: number;
  category_type: number;
  category_type_text: string;
  category_text: string;
  subcategory: number;
  subcategory_text: string;
  keywords: string;
}

export interface PayeeFilter {
  query?: string;
  target: string;
  categories?: number[];
  subcategories?: number[];
  payees?: number[];
}

export interface PayeeUpdateRequest extends Payee {
  merge_ids: number[];
}

export interface PayeeDetail {
  payee: Payee;
  transactions: TransactionExpand[];
}
