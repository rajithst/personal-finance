import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DashboardComponent} from "./dashboard/dashboard.component";
import {StockComponent} from "./stock/stock.component";
import {stockResolver} from "./service/resolvers";

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent
  },
  {
    path: ':stock',
    component: StockComponent,
    resolve: {
      stock: stockResolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InvestmentsRoutingModule { }
