import {TransactionCategory, TransactionSubCategory} from "./common";

export interface CategorySettingsRequest {
  category: TransactionCategory,
  subcategories: TransactionSubCategory[],
  deleted_sub_categories: TransactionSubCategory[],
  delete_category: boolean
}

export interface CategorySettingsResponse {
  category: TransactionCategory | null,
  subcategories: TransactionSubCategory[] | []
}
