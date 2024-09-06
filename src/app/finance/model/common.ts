
export interface Account {
  id: number,
  account_name: string,
  account_type: string,
  description: string | null
}

export interface TransactionCategory {
  id: number,
  category: string,
  category_type: number,
  category_type_text: string,
  description: string
}

export interface TransactionSubCategory {
  id: number,
  name: string,
  category: number;
  category_text: string;
  description: string | null

}

export interface ClientSettings {
  accounts: Account[];
  transaction_categories: TransactionCategory[];
  transaction_sub_categories: TransactionSubCategory[];
}
