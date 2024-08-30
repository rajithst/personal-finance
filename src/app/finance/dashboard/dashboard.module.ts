import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { MaterialModule } from '../../shared/material.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DashboardRoutingModule } from './dashboard.routing.module';
import { TransactionDashboardComponent } from './dashboard.component';
import {provideHttpClient, withInterceptors} from "@angular/common/http";
import {authInterceptor} from "../../auth/auth.interceptor";

@NgModule({
  declarations: [TransactionDashboardComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MaterialModule,
    FontAwesomeModule,
    DashboardRoutingModule,
  ],
  providers: [],
})
export class DashboardModule {}
