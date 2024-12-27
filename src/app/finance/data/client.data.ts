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
export const ACCOUNT_TYPE_INVESTMENT_ACCOUNT = 'INVESTMENT_ACCOUNT';

const CREDIT_CARD_PROVIDER_RAKUTEN = 'Rakuten';
const CREDIT_CARD_PROVIDER_EPOS_CARD = 'EPOS';
const CREDIT_CARD_PROVIDER_DOCOMO_CARD = 'Docomo';
const BANK_ACCOUNT_PROVIDER_MIZUHO = 'Mizuho';
const BANK_ACCOUNT_PROVIDER_JP_POST = 'JP POST';
const INVESTMENT_ACCOUNT_PROVIDER_RAKUTEN = 'Rakuten';

export const ACCOUNT_TYPES = [
  ACCOUNT_TYPE_CREDIT_CARD,
  ACCOUNT_TYPE_BANK_ACCOUNT,
  ACCOUNT_TYPE_INVESTMENT_ACCOUNT,
];
export const INVESTMENT_ACCOUNT_PROVIDERS = [
  INVESTMENT_ACCOUNT_PROVIDER_RAKUTEN,
];
export const CREDIT_CARD_PROVIDERS = [
  CREDIT_CARD_PROVIDER_RAKUTEN,
  CREDIT_CARD_PROVIDER_EPOS_CARD,
  CREDIT_CARD_PROVIDER_DOCOMO_CARD,
];
export const BANK_ACCOUNT_PROVIDERS = [
  BANK_ACCOUNT_PROVIDER_MIZUHO,
  BANK_ACCOUNT_PROVIDER_JP_POST,
];


export const TRANSACTION_TYPES: DropDownType[] = [
  { value: TRANSACTION_TYPE_EXPENSE_ID, viewValue: 'Expense', checked: false },
  { value: TRANSACTION_TYPE_INCOME_ID, viewValue: 'Income', checked: false },
  { value: TRANSACTION_TYPE_SAVINGS_ID, viewValue: 'Savings', checked: false },
  { value: TRANSACTION_TYPE_PAYMENTS_ID, viewValue: 'Payment', checked: false },
];


