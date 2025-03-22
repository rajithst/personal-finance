import { CreditAccount } from './account';

export interface AccountProvider {
  provider_type: string;
  value: string;
}

export interface TransactionCategory {
  id: number;
  category: string;
  category_type: number;
  category_type_text: string;
  description: string;
}

export interface TransactionSubCategory {
  id: number;
  name: string;
  category: number;
  category_text: string;
  description: string | null;
}

export interface ClientSettings {
  accounts: CreditAccount[];
  transaction_categories: TransactionCategory[];
  transaction_subcategories: TransactionSubCategory[];
  account_types: string[];
  account_providers: AccountProvider[];
}
