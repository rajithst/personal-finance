import { Injectable, signal } from '@angular/core';
import { CategoryAnalytics } from '../model/analytics';
@Injectable()
export class AnalyticsService {
  analyticsData = signal<CategoryAnalytics[] | null>(null);
  showSubcategories = signal<boolean>(false);
  dateRange = signal<string | null>(null);
  loading = signal(true);

  setAnalyticsData(data: any) {
    this.analyticsData.set(data);
  }

  setSubcategoryVisibility(isCategorySelect: boolean) {
    this.showSubcategories.set(isCategorySelect);
  }

  setDateRange(dateRange: string) {
    this.dateRange.set(dateRange);
  }
}
