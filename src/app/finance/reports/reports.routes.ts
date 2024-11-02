import { Routes } from '@angular/router';
import { ReportsComponent } from './reports.component';
import { AnalyticsComponent } from './analytics/analytics.component';

export const REPORTS_ROUTES: Routes = [
  {
    path: '',
    component: ReportsComponent,
    children: [
      {
        path: '',
        redirectTo: 'analytics',
        pathMatch: 'full',
      },
      {
        path: 'analytics',
        component: AnalyticsComponent,
        title: 'Analytics',
      },
    ],
  },
];
