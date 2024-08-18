import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {UserLogComponent} from "./user-log/user-log.component";
import {SettingsComponent} from "./settings.component";

const routes: Routes = [
  {
    path: '',
    component: SettingsComponent,
    children: [
      {
        path: '',
        redirectTo: 'user-log',
        pathMatch: 'full',
      },
      {
        path: 'user-log',
       component: UserLogComponent
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
