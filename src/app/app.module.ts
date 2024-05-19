import { NgModule } from '@angular/core';
import {
  BrowserModule,
  provideClientHydration,
} from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  HttpClientModule,
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { MaterialModule } from './shared/material.module';
import { TransactionDashboardComponent } from './finance/dashboard/dashboard.component';
import {
  TransactionUpdateDialog,
  TransactionDeleteDialog,
} from './finance/transaction-update/transaction-update.component';
import { TransactionTableComponent } from './finance/transaction-table/transaction-table.component';
import {
  ExpenseComponent,
  IncomeComponent,
  PaymentComponent,
  SavingComponent,
  TransactionComponent,
} from './finance/transaction/transaction.component';
import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';
import { SharedModule } from './shared/shared.module';
import { SubmenuComponent } from './finance/submenu/submenu.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FilterMenuComponent } from './finance/filter-menu/filter-menu.component';
import { AnalyticsComponent } from './finance/analytics/analytics.component';
import { TransactionDetailDialog } from './finance/transaction-detail/transaction-detail.component';
import { loadingInterceptor } from './core/loading.intercepter';

@NgModule({
  declarations: [
    AppComponent,
    TransactionDashboardComponent,
    TransactionComponent,
    TransactionUpdateDialog,
    TransactionDeleteDialog,
    TransactionTableComponent,
    IncomeComponent,
    ExpenseComponent,
    SavingComponent,
    PaymentComponent,
    PageNotFoundComponent,
    SubmenuComponent,
    FilterMenuComponent,
    AnalyticsComponent,
    TransactionDetailDialog,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    FontAwesomeModule,
    HttpClientModule,
    MaterialModule,
    SharedModule,
  ],
  providers: [
    provideClientHydration(),
    provideAnimationsAsync(),
    provideHttpClient(withFetch(), withInterceptors([loadingInterceptor])),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
