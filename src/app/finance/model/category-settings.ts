import {TransactionCategory, TransactionSubCategory} from "./common";

export interface CategorySettingsRequest {
  category: TransactionCategory,
  subcategories: TransactionSubCategory[]
}
