import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { MaterialModule } from './material.module';
import { IncomeComponent } from './finance/income/income.component';
import { IncomeDialog } from './finance/income/income_add/income_add.component';
import { DebtsComponent } from './finance/debts/debts.component';
import { TransactionUpdateDialog } from './finance/transaction-update/transaction-update.component';
import { TransactionTableComponent } from './finance/transaction-table/transaction-table.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { TransactionComponent} from './finance/transaction/transaction.component';

@NgModule({
  declarations: [
    AppComponent,
    IncomeComponent,
    IncomeDialog,
    DebtsComponent,
    TransactionUpdateDialog,
    TransactionTableComponent,
    TransactionComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HighchartsChartModule
  ],
  providers: [
    provideClientHydration(),
    provideAnimationsAsync(),
    provideHttpClient(withFetch()),
  ],
  bootstrap: [AppComponent],

})
export class AppModule { }
