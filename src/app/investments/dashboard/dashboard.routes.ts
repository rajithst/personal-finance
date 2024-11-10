import { Routes } from '@angular/router';
import {InvestmentDashboardComponent} from "./dashboard.component";

export const INVESTMENT_DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    component: InvestmentDashboardComponent,
    children: [],
  },
];
