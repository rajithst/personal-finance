import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PayeeRulesComponent } from './payee-rules.component';

const routes: Routes = [
  {
    path: '',
    component: PayeeRulesComponent,
    children: [],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PayeeRulesRoutingModule {}
