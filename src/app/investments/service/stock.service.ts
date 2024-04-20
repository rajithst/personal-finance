import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Stock} from "../model/stock";
import {shareReplay} from "rxjs";

@Injectable()
export class StockService {

  private SRC_URL = 'http://127.0.0.1:8000/investments';
  constructor(private http: HttpClient) {}

  loadStockBySymbol(symbol: string) {
    return this.http.get<Stock>(`${this.SRC_URL}/stock/${symbol}`)
      .pipe(
        shareReplay()
      )
  }
}
