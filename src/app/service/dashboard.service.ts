import { Injectable, signal } from '@angular/core';
import { DashboardResponse } from '../finance/model/dashboard';

@Injectable()
export class DashboardService {
  dashboardData = signal<DashboardResponse | null>(null);

  setDashboardData(data: DashboardResponse) {
    this.dashboardData.set(data);
  }

}
