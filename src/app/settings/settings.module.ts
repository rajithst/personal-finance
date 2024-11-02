import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { UserLogComponent } from './user-log/user-log.component';
import { SettingsComponent } from './settings.component';
import { TransactionCategoryComponent } from './transaction-category/transaction-category.component';
import { CreditAccountComponent } from './credit-account/credit-account.component';

import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
  ActionConfirmComponent,
  CategoryEditComponent,
} from './transaction-category/category-edit/category-edit.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { AccountEditComponent } from './credit-account/account-edit/account-edit.component';


@NgModule({
    imports: [
    CommonModule,
    SettingsRoutingModule,
    FaIconComponent,
    ReactiveFormsModule,
    UserLogComponent,
    SettingsComponent,
    TransactionCategoryComponent,
    CreditAccountComponent,
    CategoryEditComponent,
    ActionConfirmComponent,
    AccountEditComponent,
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
