import {ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot} from "@angular/router";
import {inject} from "@angular/core";
import {SessionService} from "./session.service";


export const refreshResolver: ResolveFn<any> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  console.log('resolving dddata..')
  return inject(SessionService).refresh()
}
