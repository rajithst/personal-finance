import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SavingsRoutingModule } from './savings-routing.module';
import { AddComponent } from './add/add.component';
import { ListingComponent } from './listing/listing.component';


@NgModule({
  declarations: [
    AddComponent,
    ListingComponent
  ],
  imports: [
    CommonModule,
    SavingsRoutingModule
  ]
})
export class SavingsModule { }
