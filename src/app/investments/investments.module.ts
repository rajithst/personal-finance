import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InvestmentsRoutingModule } from './investments-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StockComponent } from './stock/stock.component';
import { SharedModule } from '../shared/shared.module';
import { HoldingsComponent } from './holdings/holdings.component';
import { DividendComponent } from './dividend/dividend.component';
import { SessionService } from './service/session.service';
import { HomeComponent } from './home/home.component';
import { SubmenuComponent } from './submenu/submenu.component';
import { TradeDialogComponent } from './trade-dialog/trade-dialog.component';
import { MaterialModule } from '../shared/material.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TradeHistoryComponent } from './trade-history/trade-history.component';
import { HoldingTableComponent } from './holdings/holding-table/holding-table.component';

@NgModule({
  declarations: [
    DashboardComponent,
    StockComponent,
    HoldingsComponent,
    DividendComponent,
    HomeComponent,
    SubmenuComponent,
    TradeDialogComponent,
    TradeHistoryComponent,
    HoldingTableComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MaterialModule,
    FontAwesomeModule,
    InvestmentsRoutingModule,
  ],
  providers: [SessionService],
})
export class InvestmentsModule {}
