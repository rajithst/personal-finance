import { Routes } from '@angular/router';
import { PayeeSettingsComponent } from './payee-settings.component';
import { PayeesComponent } from './payees/payees.component';
import { RecurringComponent } from './recurring/recurring.component';
import { PayeeDetailComponent } from './payee-detail/payee-detail.component';

export const PAYEE_SETTINGS_ROUTES: Routes = [
  {
    path: '',
    component: PayeeSettingsComponent,
    children: [
      {
        path: '',
        redirectTo: 'payees',
        pathMatch: 'full',
      },
      {
        path: 'payees',
        component: PayeesComponent,
        title: 'Payees',
      },
      {
        path: 'recurring-payments',
        component: RecurringComponent,
        title: 'Recurring Payments',
      },
      {
        path: ':id/:name',
        component: PayeeDetailComponent,
        title: 'Payees',
        data: { breadcrumb: 'Payee Settings' },
      },
      {
        path: ':name',
        component: PayeeDetailComponent,
        title: 'Payees',
        data: { breadcrumb: 'Payee Detail' },
      },
    ],
  },
];
