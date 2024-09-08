import {TransactionExpand} from "./transactions";

export interface PayeeResponse {
  payees: DestinationMap[];
}

export interface DestinationMap {
  id: number;
  destination: string;
  destination_original: string;
  destination_eng: string;
  category: number;
  category_type: number;
  category_text: string;
  subcategory: number;
  subcategory_text: string;
  keywords: string;
}
export interface DestinationMapRequest extends DestinationMap {
  merge_ids: number[]
}


export interface PayeeDetail {
  payee: DestinationMap,
  transactions: TransactionExpand[]
}
