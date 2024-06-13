export interface MonthlyTransaction {
  year: number;
  month: number;
  month_text: string;
  total: number;
  transactions: TransactionExpand[];
  transactions_cp: TransactionExpand[];
}

export interface Transaction {
  id: number | null;
  amount: number | null;
  date: string;
  destination: string;
  alias: string;
  category: number;
  subcategory: number;
  notes: string;
  is_saving: boolean;
  is_payment: boolean;
  is_expense: boolean;
  is_deleted: boolean;
  is_merge: boolean;
  merge_id: number | null;
  delete_reason: string;
  payment_method: number;
}

export interface TransactionExpand extends Transaction {
  category_text: string;
  subcategory_text: string;
  payment_method_text: string;
  year: number;
  month: number;
  month_text: string;
  checked: boolean | false;
}

export interface TransactionsResponse {
  income: MonthlyTransaction[];
  expense: MonthlyTransaction[];
  saving: MonthlyTransaction[];
  payment: MonthlyTransaction[];
  destinations: string[];
}

export interface TransactionRequest extends Transaction {
  is_regular_destination: boolean;
  update_similar: boolean;
  //merged_ids: number[] | null
}

export interface TransactionFilterDialogData {
  categories: number[];
  subcategories: number[];
  paymentMethods: number[];
  years: number[];
  months: number[];
}
