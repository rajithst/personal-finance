import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class DataService {
  private holding$ = new BehaviorSubject<boolean>(false);
  holdingUpdate$ = this.holding$.asObservable();

  setHoldingUpdate() {
    this.holding$.next(true);
  }
}
