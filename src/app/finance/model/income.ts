export interface IncomeResponse {
  payload: MonthlyIncome[];
}

export interface MonthlyIncome {
  year: number;
  month: number;
  month_text: string;
  total: number;
  transactions: Income[];
}

export interface Income {
  id: number;
  category: number;
  category_text?: string;
  amount: number;
  date: string;
  destination: string;
  year: number;
  month: number;
  month_text: string;
  notes: string | null;
}
