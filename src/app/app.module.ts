import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgChartsModule } from 'ng2-charts';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from './material.module';
import { IncomeComponent } from './finance/income/income.component';
import { IncomeAddComponent } from './finance/income/income_add/income_add.component';
import { SavingsComponent } from './finance/savings/savings.component';
import { SavingsAddComponent } from './finance/savings/savings_add/savings_add.component';
import { SpendingsComponent } from './finance/spendings/spendings.component';
import { DebtsComponent } from './finance/debts/debts.component';
import { BillsAndSubscriptionsComponent } from './finance/bills-and-subscriptions/bills-and-subscriptions.component';

@NgModule({
  declarations: [
    AppComponent,
    IncomeComponent,
    IncomeAddComponent,
    SavingsComponent,
    SavingsAddComponent,
    SpendingsComponent,
    DebtsComponent,
    BillsAndSubscriptionsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgChartsModule
  ],
  providers: [
    provideClientHydration(),
    provideAnimationsAsync(),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
