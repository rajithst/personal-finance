import {ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot} from "@angular/router";
import {Stock} from "../model/stock";
import {inject} from "@angular/core";
import {StockService} from "./stock.service";

export const stockResolver: ResolveFn<Stock> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  return inject(StockService).loadStockBySymbol(route.paramMap.get('stock')!)
}
