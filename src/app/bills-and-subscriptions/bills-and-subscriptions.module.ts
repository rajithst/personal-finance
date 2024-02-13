import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BillsAndSubscriptionsRoutingModule } from './bills-and-subscriptions-routing.module';
import { AddComponent } from './add/add.component';
import { ListingComponent } from './listing/listing.component';


@NgModule({
  declarations: [
    AddComponent,
    ListingComponent
  ],
  imports: [
    CommonModule,
    BillsAndSubscriptionsRoutingModule
  ]
})
export class BillsAndSubscriptionsModule { }
