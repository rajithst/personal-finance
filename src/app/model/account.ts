export interface CreditAccountRequest {
  id: number;
  account_name: string;
  account_type: string;
  description: string | null;
  provider: string;
}

export interface CreditAccount {
  id: number;
  account_name: string;
  account_type: string;
  description: string | null;
  last_import_date: string | null;
  provider: string;
}
