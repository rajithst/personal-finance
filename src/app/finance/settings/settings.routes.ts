import { Routes } from '@angular/router';
import { ActivityLog } from './activity-log/activity-log.component';
import { SettingsComponent } from './settings.component';
import { TransactionCategoryComponent } from './transaction-category/transaction-category.component';
import { CreditAccountComponent } from './credit-account/credit-account.component';

export const SETTINGS_ROUTES: Routes = [
  {
    path: '',
    component: SettingsComponent,
    children: [
      {
        path: '',
        redirectTo: 'category',
        pathMatch: 'full',
      },
      {
        path: 'category',
        component: TransactionCategoryComponent,
      },
      {
        path: 'credit-accounts',
        component: CreditAccountComponent,
      },
      {
        path: 'activity-log',
        component: ActivityLog,
      },
    ],
  },
];
