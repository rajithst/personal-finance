import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SavingsRoutingModule } from './savings-routing.module';
import { AddComponent } from './add/add.component';
import { ListingComponent } from './listing/listing.component';
import { MaterialModule } from '../../material.module';
import { provideNativeDateAdapter } from '@angular/material/core';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AddComponent,
    ListingComponent,
    AddComponent,
  ],
  imports: [
    CommonModule,
    SavingsRoutingModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  providers: [provideNativeDateAdapter()],
})
export class SavingsModule { }
