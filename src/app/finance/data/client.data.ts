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
