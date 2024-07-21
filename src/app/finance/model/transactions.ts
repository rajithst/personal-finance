export interface ExpenseResponse {
  payload: MonthlyTransaction[]
}

interface CategoryAmount {
  category_id: number;
  amount: number;
}

interface DestinationAmount {
  amount: number;
  destination: string;
  destination_original: string;
}

interface MonthlyCategorySum {
  [date: string]: CategoryAmount[];
}

interface DashboardTransaction {
  year: number,
  month: number,
  amount: number,
}

interface MonthlyPayment {
  [date: string]: DestinationAmount[];
}

export interface DashboardResponse {
  expense: DashboardTransaction[];
  payment: DashboardTransaction[];
  saving: DashboardTransaction[];
  income: DashboardTransaction[];
  category_wise_expenses: MonthlyCategorySum;
  payment_method_wise_expenses: MonthlyCategorySum;
  payment_by_destination: MonthlyPayment;
}

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
  update_similar: boolean;
}

export interface TransactionMergeRequest extends Transaction {
  update_similar: boolean;
  merge_ids: number[];
}

export interface TransactionFilter {
  year: number;
  target: string;
  categories?: number[];
  subcategories?: number[];
  paymentMethods?: number[];
}


export interface TransactionFilterTemplate {
  target: string;
  conditions: TransactionFilter;

}
