
export interface Account {
  id: number,
  account_name: string,
  account_type: string,
  description: string | null
}

export interface IncomeCategory {
  id: number,
  category: string
}

export interface TransactionCategory {
  id: number,
  category: string
}

export interface TransactionSubCategory {
  id: number,
  name: string,
  description: string | null
  category: number
}
export interface ClientSettings {
  accounts: Account[],
  income_categories: IncomeCategory[],
  transaction_categories: TransactionCategory[],
  transaction_sub_categories: TransactionSubCategory[],

}
