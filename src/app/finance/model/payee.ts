import { TransactionExpand } from './transactions';

export interface PayeeResponse {
  payees: Payee[];
}

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

export interface PayeeUpdateRequest extends Payee {
  merge_ids: number[];
}

export interface PayeeDetail {
  payee: Payee;
  transactions: TransactionExpand[];
}
