import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { AccountComponent } from './account/account.component';

import { ProfileComponent } from './profile.component';
import { SecurityComponent } from './security/security.component';
import { BillingComponent } from './billing/billing.component';


@NgModule({
    imports: [CommonModule, ProfileRoutingModule, AccountComponent,
    ProfileComponent,
    SecurityComponent,
    BillingComponent],
})
export class ProfileModule {}
