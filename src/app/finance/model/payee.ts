export interface PayeeResponse {
  payees: DestinationMap[];
  rewrite_rules: RewriteRule[];
}

export interface DestinationMap {
  id: number;
  destination: string;
  destination_eng: string;
  category: number;
  category_text: string;
  subcategory: number;
  subcategory_text: string;
}

export interface RewriteRule {
  id: number;
  destination: string;
  keywords: string;
}
