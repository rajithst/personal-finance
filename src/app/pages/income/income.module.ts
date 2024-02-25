import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideNativeDateAdapter } from '@angular/material/core';
import { ReactiveFormsModule } from '@angular/forms';

import { IncomeRoutingModule } from './income-routing.module';
import { ListingComponent } from './listing/listing.component';
import { AddComponent } from './add/add.component';
import { MaterialModule } from '../../material.module'
import { IncomeService } from './income.service';
import { HttpErrorHandler } from '../../service/http-error-handler.service';
import { MessageService } from '../../service/message.service';


@NgModule({
  declarations: [
    ListingComponent,
    AddComponent
  ],
  imports: [
    CommonModule,
    IncomeRoutingModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  providers: [provideNativeDateAdapter(), IncomeService, HttpErrorHandler, MessageService],
})
export class IncomeModule { }
