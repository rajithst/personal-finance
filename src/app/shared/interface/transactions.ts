
export interface MonthlyTransaction {
    year: number;
    month: number;
    month_text: string;
    total: number;
    transactions: Transaction[];
    transactions_cp: Transaction[];
}

export interface Transaction {
    id: number;
    category: number;
    subcategory: number;
    category_text?: string;
    subcategory_text: string | null;
    is_payment: boolean,
    is_deleted: boolean,
    is_saving: boolean,
    is_expense: boolean,
    payment_method: number;
    payment_method_text: string | null;
    amount: number;
    date: string;
    destination: string;
    alias: string | null;
    year: number;
    month: number;
    month_text: string;
    notes: string | null;
}

export interface TransactionRequest {
    id: number | null;
    category: number;
    subcategory: number;
    payment_method: number;
    destination: string;
    is_payment: boolean,
    is_deleted: boolean,
    is_saving: boolean,
    is_expense: boolean,
    alias: string;
    amount: number;
    date: string;
    notes: string | null;
    update_similar: boolean
}
export interface TransactionsResponse {
    income: MonthlyTransaction[];
    expense: MonthlyTransaction[];
    saving: MonthlyTransaction[];
    payment: MonthlyTransaction[];
}


