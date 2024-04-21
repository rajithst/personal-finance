import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DashboardComponent} from "./dashboard/dashboard.component";
import {StockComponent} from "./stock/stock.component";
import {stockResolver} from "./service/resolvers";
import {ProtofolioComponent} from "./protofolio/protofolio.component";

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: 'profile',
        component: ProtofolioComponent,
      },
      {
        path: 'stock',
        component: StockComponent,
      },
    ]
  },

  // {
  //   path: 'stock',
  //   component: StockComponent,
    // children: [
    //   {
    //     path: ':symbol',
    //     component: StockComponent,
    //
    //   }
    // ],
    // resolve: {
    //       symbol: stockResolver
    // }
  //}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InvestmentsRoutingModule { }
