import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PayeeSettingsComponent } from './payee-settings.component';
import {PayeesComponent} from "./payees/payees.component";
import {payeeResolver} from "../service/resolvers";
import {RecurringComponent} from "./recurring/recurring.component";

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
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PayeeSettingsRoutingModule {}
