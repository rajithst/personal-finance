import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountComponent } from './account/account.component';
import { profileResolver } from '../auth/profile.resolver';
import {ProfileComponent} from "./profile.component";
import {SecurityComponent} from "./security/security.component";
import {BillingComponent} from "./billing/billing.component";

const routes: Routes = [
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
        resolve: {
          myAccount: profileResolver,
        },
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

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileRoutingModule {}
