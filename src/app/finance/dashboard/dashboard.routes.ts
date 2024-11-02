import { Routes } from '@angular/router';
import { TransactionDashboardComponent } from './dashboard.component';

export const FINANCE_DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    component: TransactionDashboardComponent,
    children: [],
  },
];
