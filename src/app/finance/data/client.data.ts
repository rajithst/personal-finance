export interface DropDownType {
  value: number;
  viewValue: string;
  checked: boolean;
}

export const EXPENSE: string = 'expense';
export const PAYMENT: string = 'payment';
export const SAVING: string = 'saving';
export const INCOME: string = 'income';

export const TRANSACTION_TYPE_EXPENSE_ID = 1;
export const TRANSACTION_TYPE_INCOME_ID = 2;
export const TRANSACTION_TYPE_SAVINGS_ID = 3;
export const TRANSACTION_TYPE_PAYMENTS_ID = 4;

export const ACCOUNT_TYPE_CREDIT_CARD = 'CREDIT_CARD';
export const ACCOUNT_TYPE_BANK_ACCOUNT = 'BANK_ACCOUNT';

export const TRANSACTION_TYPES: DropDownType[] = [
  { value: TRANSACTION_TYPE_EXPENSE_ID, viewValue: 'Expense', checked: false },
  { value: TRANSACTION_TYPE_INCOME_ID, viewValue: 'Income', checked: false },
  { value: TRANSACTION_TYPE_SAVINGS_ID, viewValue: 'Savings', checked: false },
  { value: TRANSACTION_TYPE_PAYMENTS_ID, viewValue: 'Payment', checked: false },
];


export const DEFAULT_ANALYTICS_DATE_RANGE: DropDownType[] = [
  { value: 0, viewValue: 'All', checked: false },
  { value: 1, viewValue: 'This Month', checked: false },
  { value: 2, viewValue: 'Last Month', checked: false },
  { value: 3, viewValue: 'Last 3 months', checked: false },
  { value: 4, viewValue: 'Last 6 months', checked: false },
  { value: 5, viewValue: 'This year', checked: false },
  { value: 6, viewValue: 'Last year', checked: false },
]
