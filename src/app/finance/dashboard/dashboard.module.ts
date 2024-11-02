import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DashboardRoutingModule } from './dashboard.routing.module';
import { TransactionDashboardComponent } from './dashboard.component';

@NgModule({
    imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    DashboardRoutingModule,
    TransactionDashboardComponent,
],
    providers: [],
})
export class DashboardModule {}
