import { Routes } from '@angular/router';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { InvestmentsComponent } from './investments.component';
import { HoldingsComponent } from './holdings/holdings.component';
import { DividendComponent } from './dividend/dividend.component';
import { PurchaseHistoryComponent } from './purchase-history/purchase-history.component';
import {DividendFlowComponent} from "./dividend/dividend-flow/dividend-flow.component";

export const INVESTMENT_ROUTES: Routes = [
  {
    path: '',
    component: InvestmentsComponent,
    children: [
      {
        path: '',
        redirectTo: 'portfolio',
        pathMatch: 'full',
      },
      {
        path: 'portfolio',
        component: PortfolioComponent,
        title: 'Expense Activity',
      },
      {
        path: 'holdings',
        component: HoldingsComponent,
        title: 'Expense Activity',
      },
      {
        path: 'dividends',
        component: DividendComponent,
        title: 'Expense Activity',
      },
      {
        path: 'dividends/history',
        component: DividendFlowComponent,
        title: 'Expense Activity',
      },
      {
        path: 'purchase-history',
        component: PurchaseHistoryComponent,
        title: 'Expense Activity',
      },
    ],
  },
];
