import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvestmentsRoutingModule } from './investments-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StockComponent } from './stock/stock.component';
import {StockService} from "./service/stock.service";
import {SharedModule} from "../shared/shared.module";
import { ProtofolioComponent } from './protofolio/protofolio.component';
import {MatFabButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";


@NgModule({
  declarations: [DashboardComponent, StockComponent, ProtofolioComponent],
  imports: [
    CommonModule,
    SharedModule,
    InvestmentsRoutingModule,
    MatFabButton,
    MatIcon,
  ],
  providers: [StockService],
})
export class InvestmentsModule {}
