import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvestmentsRoutingModule } from './investments-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StockComponent } from './stock/stock.component';
import {SharedModule} from "../shared/shared.module";
import { ProtofolioComponent } from './protofolio/protofolio.component';
import {MatFabButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import { DividendComponent } from './dividend/dividend.component';
import {SessionService} from "./service/session.service";
import { HomeComponent } from './home/home.component';
import { SubmenuComponent } from './submenu/submenu.component';


@NgModule({
  declarations: [DashboardComponent, StockComponent, ProtofolioComponent, DividendComponent, HomeComponent, SubmenuComponent],
  imports: [
    CommonModule,
    SharedModule,
    InvestmentsRoutingModule,
    MatFabButton,
    MatIcon,
  ],
  providers: [SessionService],
})
export class InvestmentsModule {}
