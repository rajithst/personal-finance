import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import {inject} from "@angular/core";
import {LoadingService} from "../shared/loading/loading.service";
import {SkipLoading} from "../shared/loading/loading.component";
import {finalize} from "rxjs/operators";

export const loadingInterceptor: HttpInterceptorFn =
  (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
    if(req.context.get(SkipLoading)) {
      return next(req);
    }
    const loadingService = inject(LoadingService);
    console.log('loading on from intercepter')
    loadingService.loadingOn();
    return next(req)
      .pipe(
        finalize(() => {
          console.log('loading off from intercepter')
          loadingService.loadingOff()
        })
      )
  }
