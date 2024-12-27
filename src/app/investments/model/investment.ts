import {CreditAccount} from "../../finance/model/account";
import {Portfolio} from "./portfolio";

export interface InvestmentClientSettings {
  broker_accounts: CreditAccount[];
  portfolios: Portfolio[];
}

export interface CompanyInfo {
  symbol: string;
  company_name: string;
  sector: string;
  industry: string;
  exchange: string;
  stock_currency: string;
  currency: string;
  country: string;
  website: string;
  image: string;
  description: string;
}






