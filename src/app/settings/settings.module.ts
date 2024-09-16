import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { UserLogComponent } from './user-log/user-log.component';
import { SettingsComponent } from './settings.component';
import { TransactionCategoryComponent } from './transaction-category/transaction-category.component';
import { CreditAccountComponent } from './credit-account/credit-account.component';
import { MaterialModule } from '../shared/material.module';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
  ActionConfirmComponent,
  CategoryEditComponent,
} from './transaction-category/category-edit/category-edit.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { AccountEditComponent } from './credit-account/account-edit/account-edit.component';
import {SharedModule} from "../shared/shared.module";

@NgModule({
  declarations: [
    UserLogComponent,
    SettingsComponent,
    TransactionCategoryComponent,
    CreditAccountComponent,
    CategoryEditComponent,
    ActionConfirmComponent,
    AccountEditComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    SettingsRoutingModule,
    FaIconComponent,
    ReactiveFormsModule,
    SharedModule,
  ],
  providers: [
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: {
        width: '850px',
        position: {
          top: '5%',
        },
      },
    },
  ],
})
export class SettingsModule {}
