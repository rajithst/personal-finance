import { Injectable } from '@angular/core';
import { MONTHS } from '../../shared/data/client.data';

@Injectable()
export class ChartUtilityService {
  currentYear = new Date().getFullYear();
  currentMonthNumber = new Date().getMonth();
  lastMonthNumber = new Date().getMonth() - 1;
  currentMonthKey = `${this.currentYear}-${String(this.currentMonthNumber).padStart(2, '0')}-01`;

  constructor() {}

  getMonthList() {
    return MONTHS.map((month) => month.viewValue);
  }

  getCurrentMonth() {
    return (
      MONTHS.find((m) => m.value === this.currentMonthNumber)?.viewValue ?? ''
    );
  }

  getCurrentYear() {
    return this.currentYear.toString();
  }
}
