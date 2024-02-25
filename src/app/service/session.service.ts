import { Injectable } from '@angular/core';

export class SessionData {
  incomes: [] =  [];
  savings: [] = [];
}

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor() { }
}
