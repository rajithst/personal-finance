import {ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot} from "@angular/router";
import {inject} from "@angular/core";
import {SessionService} from "./session.service";
import {ApiService} from "../../core/api.service";


export const investmentDataResolver: ResolveFn<any> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  return inject(ApiService).getInvestments()
}
