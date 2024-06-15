export interface PayeeResponse {
  payees: DestinationMap[];
}

export interface DestinationMap {
  id: number;
  destination: string;
  destination_eng: string;
  category: number;
  category_text: string;
  subcategory: number;
  subcategory_text: string;
  keywords: string;
}

