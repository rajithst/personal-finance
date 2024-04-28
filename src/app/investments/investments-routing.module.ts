import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DashboardComponent} from "./dashboard/dashboard.component";
import {StockComponent} from "./stock/stock.component";
import {investmentDataResolver} from "./service/resolvers";
import {HoldingsComponent} from "./holdings/holdings.component";
import {DividendComponent} from "./dividend/dividend.component";
import {HomeComponent} from "./home/home.component";


const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    resolve: {
      all: investmentDataResolver
    }
  },
  {
    path: 'profile',
    component: HoldingsComponent,
  },
  {
    path: 'stock',
    component: StockComponent,
  },
  {
    path: 'dividend',
    component: DividendComponent,
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InvestmentsRoutingModule { }
