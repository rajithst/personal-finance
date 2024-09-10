import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { UserLogComponent } from './user-log/user-log.component';
import { SettingsComponent } from './settings.component';
import { TransactionCategoryComponent } from './transaction-category/transaction-category.component';
import { CreditAccountComponent } from './credit-account/credit-account.component';
import {MaterialModule} from "../shared/material.module";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";


@NgModule({
  declarations: [
    UserLogComponent,
    SettingsComponent,
    TransactionCategoryComponent,
    CreditAccountComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    SettingsRoutingModule,
    FaIconComponent,
  ],
})
export class SettingsModule {}
