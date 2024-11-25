import { Injectable, signal } from '@angular/core';
import { DashboardResponse } from '../model/dashboard';

@Injectable()
export class DashboardService {
  dashboardData = signal<DashboardResponse | null>(null);

  setDashboardData(data: DashboardResponse) {
    console.log(data);
    this.dashboardData.set(data);
  }
}
