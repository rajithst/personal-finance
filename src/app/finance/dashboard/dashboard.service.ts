import { Injectable, signal } from '@angular/core';
import { DashboardResponse } from '../model/dashboard';

@Injectable()
export class DashboardService {
  dashboardData = signal<DashboardResponse | null>(null);
  loading = signal(true);

  setDashboardData(data: DashboardResponse) {
    this.dashboardData.set(data);
  }

  setLoading(value: boolean) {
    this.loading.set(value);
  }
}
