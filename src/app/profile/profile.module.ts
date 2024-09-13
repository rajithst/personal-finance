import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { AccountComponent } from './account/account.component';
import {MaterialModule} from "../shared/material.module";
import { ProfileComponent } from './profile.component';
import { SecurityComponent } from './security/security.component';
import { BillingComponent } from './billing/billing.component';


@NgModule({
  declarations: [
    AccountComponent,
    ProfileComponent,
    SecurityComponent,
    BillingComponent
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    MaterialModule
  ]
})
export class ProfileModule { }
