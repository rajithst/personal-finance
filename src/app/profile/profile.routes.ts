import { Routes } from '@angular/router';
import { AccountComponent } from './account/account.component';
import { ProfileComponent } from './profile.component';
import { SecurityComponent } from './security/security.component';
import { BillingComponent } from './billing/billing.component';

export const PROFILE_ROUTES: Routes = [
  {
    path: '',
    component: ProfileComponent,
    children: [
      {
        path: '',
        redirectTo: 'me',
        pathMatch: 'full',
      },
      {
        path: 'me',
        component: AccountComponent,
      },
      {
        path: 'security',
        component: SecurityComponent,
      },
      {
        path: 'billing',
        component: BillingComponent,
      },
    ],
  },
];

