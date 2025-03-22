
export interface CategoryAnalytics {
  category: string;
  color?:string;
  total: number;
  subcategories: SubcategorySummary[];
}
export interface SubcategorySummary {
  category: string;
  subcategory: string;
  category_id: number;
  subcategory_id: number;
  total: number;
  color?:string;
}
