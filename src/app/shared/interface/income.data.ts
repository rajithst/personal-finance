
export interface IncomeRequest {
    id: number | null;
    category: number;
    amount: number;
    date: string;
    notes: string | null;
}

export interface Income {
    id: number;
    category: number;
    category_text?: string;
    amount: number;
    date: string;
    year: number;
    month: number;
    month_text: string;
    notes: string | null;
}

export interface MonthlyIncome {
    year: number;
    month: number;
    month_text: string;
    total: number;
    transactions: Income[];
}
