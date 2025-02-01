import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private readonly loader$ = new BehaviorSubject<boolean>(false);
  loading$ = this.loader$.asObservable();

  setLoading(value: boolean) {
    this.loader$.next(value);
  }
}
