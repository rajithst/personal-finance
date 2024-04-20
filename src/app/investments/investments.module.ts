import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvestmentsRoutingModule } from './investments-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StockComponent } from './stock/stock.component';
import {StockService} from "./service/stock.service";
import {SharedModule} from "../shared/shared.module";


@NgModule({
  declarations: [
    DashboardComponent,
    StockComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    InvestmentsRoutingModule
  ],
  providers: [StockService]
})
export class InvestmentsModule { }
