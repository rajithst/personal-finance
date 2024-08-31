import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserLogComponent } from './user-log/user-log.component';
import { SettingsComponent } from './settings.component';
import {TransactionCategoryComponent} from "./transaction-category/transaction-category.component";

const routes: Routes = [
  {
    path: '',
    component: SettingsComponent,
    children: [
      {
        path: '',
        redirectTo: 'category-settings',
        pathMatch: 'full',
      },
      {
        path: 'category-settings',
        component: TransactionCategoryComponent,
      },
      {
        path: 'user-log',
        component: UserLogComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsRoutingModule {}
