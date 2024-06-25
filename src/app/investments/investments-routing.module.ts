import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DashboardComponent} from "./dashboard/dashboard.component";
import {investmentDataResolver} from "./service/resolvers";
import {HoldingsComponent} from "./holdings/holdings.component";
import {DividendComponent} from "./dividend/dividend.component";
import {HomeComponent} from "./home/home.component";
import {TradeHistoryComponent} from "./trade-history/trade-history.component";


const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    resolve: {
      investments: investmentDataResolver
    },
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'profile',
        component: HoldingsComponent,
      },
      {
        path: 'dividend',
        component: DividendComponent,
      },
      {
        path: 'trade-history',
        component: TradeHistoryComponent,
      },
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InvestmentsRoutingModule { }
