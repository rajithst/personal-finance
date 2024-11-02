import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { ReportsComponent } from './reports.component';
import { ReportsRoutingModule } from './reports.routing.module';
import { AnalyticsComponent } from './analytics/analytics.component';

@NgModule({
    imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    ReportsRoutingModule,
    ReportsComponent, AnalyticsComponent,
],
    providers: [
        {
            provide: MAT_DIALOG_DEFAULT_OPTIONS,
            useValue: {
                width: '850px',
                position: {
                    top: '10%',
                },
            },
        },
    ],
})
export class ReportsModule {}
