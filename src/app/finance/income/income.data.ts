export interface Income {
    category: number;
    amount: number;
    date: string;
    year: number;
    month: number;
    month_text: string;
    target_month: number | null;
    target_month_text: string | null;
    notes: string | null;
}

export interface IncomeList {
    year: number
    month: string
    incomes: MonthlyIncome[]
}

export interface MonthlyIncome {
    date: string;
    source: string;
    amount: number;
}
