import { Injectable, signal } from '@angular/core';
import { Analytics } from '../model/analytics';
@Injectable()
export class AnalyticsService {
  analyticsData = signal<Analytics[] | null>(null);
  loading = signal(true);

  setAnalyticsData(data: any) {
    this.analyticsData.set(data);
  }
}
