export interface IncomeResponse {
  payload: MonthlyIncome[];
}

export interface MonthlyIncome {
  year: number;
  month: number;
  month_text: string;
  total: number;
  transactions: IncomeExpand[];
}

export interface Income {
  id: number;
  category: number;
  amount: number;
  date: string;
  destination: string;
  notes: string | null;
  is_deleted: boolean;
  delete_reason: string;
}

export interface IncomeExpand extends Income {
  year: number;
  month: number;
  category_text: string;
  month_text: string;
}
