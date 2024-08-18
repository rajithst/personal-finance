import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PayeeSettingsComponent } from './payee-settings.component';
import { PayeesComponent } from './payees/payees.component';
import { payeeDetailResolver, payeeResolver } from '../service/resolvers';
import { RecurringComponent } from './recurring/recurring.component';
import { PayeeDetailComponent } from './payee-detail/payee-detail.component';

const routes: Routes = [
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
        resolve: {
          payeeData: payeeResolver,
        },
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
        resolve: {
          payee: payeeDetailResolver,
        },
      },
      {
        path: ':name',
        component: PayeeDetailComponent,
        title: 'Payees',
        data: { breadcrumb: 'Payee Detail' },
        resolve: {
          payee: payeeDetailResolver,
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PayeeSettingsRoutingModule {}
