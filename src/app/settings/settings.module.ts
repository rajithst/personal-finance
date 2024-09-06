import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { UserLogComponent } from './user-log/user-log.component';
import { SettingsComponent } from './settings.component';
import { TransactionCategoryComponent } from './transaction-category/transaction-category.component';


@NgModule({
  declarations: [
    UserLogComponent,
    SettingsComponent,
    TransactionCategoryComponent
  ],
  imports: [
    CommonModule,
    SettingsRoutingModule
  ]
})
export class SettingsModule { }
