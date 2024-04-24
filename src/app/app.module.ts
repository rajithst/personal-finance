import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { MaterialModule } from './material.module';
import { TransactionDashboardComponent } from './finance/dashboard/dashboard.component';
import { TransactionUpdateDialog } from './finance/transaction-update/transaction-update.component';
import { TransactionTableComponent } from './finance/transaction-table/transaction-table.component';
import { TransactionComponent} from './finance/transaction/transaction.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { PfBarChartComponent } from './finance/charts/pf-bar-chart/pf-bar-chart.component';
import { PfPieChartComponent } from './finance/charts/pf-pie-chart/pf-pie-chart.component';
import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';
import {SharedModule} from "./shared/shared.module";
import { SubmenuComponent } from './finance/submenu/submenu.component';

@NgModule({
  declarations: [
    AppComponent,
    TransactionDashboardComponent,
    TransactionUpdateDialog,
    TransactionTableComponent,
    TransactionComponent,
    PfBarChartComponent,
    PfPieChartComponent,
    PageNotFoundComponent,
    SubmenuComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MaterialModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgxChartsModule,
  ],
  providers: [
    provideClientHydration(),
    provideAnimationsAsync(),
    provideHttpClient(withFetch()),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
