import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SpendingsRoutingModule } from './spendings-routing.module';
import { AddComponent } from './add/add.component';
import { ListingComponent } from './listing/listing.component';
import { MaterialModule } from '../../material.module'
import { provideNativeDateAdapter } from '@angular/material/core';

@NgModule({
  declarations: [
    AddComponent,
    ListingComponent
  ],
  imports: [
    CommonModule,
    SpendingsRoutingModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  providers: [provideNativeDateAdapter()],
})
export class SpendingsModule { }
