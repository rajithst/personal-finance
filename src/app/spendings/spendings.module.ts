import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SpendingsRoutingModule } from './spendings-routing.module';
import { AddComponent } from './add/add.component';
import { ListingComponent } from './listing/listing.component';


@NgModule({
  declarations: [
    AddComponent,
    ListingComponent
  ],
  imports: [
    CommonModule,
    SpendingsRoutingModule
  ]
})
export class SpendingsModule { }
