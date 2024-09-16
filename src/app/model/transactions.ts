export interface TransactionsResponse {
  payload: MonthlyTransaction[];
}

export interface MonthlyTransaction {
  year: number;
  month: number;
  month_text: string;
  total: number;
  transactions: TransactionExpand[];
}

export interface Transaction {
  id: number | null;
  amount: number | null;
  date: string;
  destination: string;
  alias: string;
  category: number | null;
  subcategory: number | null;
  notes: string;
  is_saving: boolean;
  is_payment: boolean;
  is_expense: boolean;
  is_deleted: boolean;
  is_income: boolean;
  is_merge: boolean;
  merge_id: number | null;
  delete_reason: string;
  account: number;
  source: number;
}

export interface TransactionExpand extends Transaction {
  category_text?: string;
  subcategory_text?: string;
  account_name: string;
  account_type: string;
  year: number;
  month: number;
  month_text: string;
}

export interface TransactionRequest extends Transaction {
  update_similar: boolean;
}

export interface TransactionMergeRequest extends Transaction {
  update_similar: boolean;
  merge_ids: number[];
}

export interface TransactionFilter {
  query?: string;
  year: number;
  target: string;
  categories?: number[];
  subcategories?: number[];
  accounts?: number[];
}

export interface TransactionSplit {
  destination: string;
  category: number;
  amount: number;
}

export interface BulkDeleteRequest {
  task: string;
  delete_ids: number[] | null;
}

export interface BulkDeleteResponse {
  status: number;
  data: TransactionExpand[] | null;
}

export interface TransactionSplitRequest {
  task: string;
  main: TransactionExpand;
  splits: TransactionSplit[];
}

export interface TransactionSplitResponse {
  status: number;
  data: TransactionExpand[] | null;
}
