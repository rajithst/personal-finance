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
import { SavingsComponent } from './finance/savings/savings.component';
import { ExpenseComponent } from './finance/expense/expense.component';
import { DebtsComponent } from './finance/debts/debts.component';
import { PaymentComponent } from './finance/payment/payment.component';
import { TransactionUpdateDialog } from './shared/transaction-table/transaction-update/transaction-update.component';
import { TransactionTableComponent } from './shared/transaction-table/transaction-table.component';
import { ToolbarComponent } from './shared/toolbar/toolbar.component';
import { HighchartsChartModule } from 'highcharts-angular';

@NgModule({
  declarations: [
    AppComponent,
    IncomeComponent,
    IncomeDialog,
    SavingsComponent,
    ExpenseComponent,
    DebtsComponent,
    PaymentComponent,
    TransactionUpdateDialog,
    TransactionTableComponent,
    ToolbarComponent,
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
