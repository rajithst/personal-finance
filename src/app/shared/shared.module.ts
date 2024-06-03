import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from './loading/loading.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MaterialModule } from './material.module';
import { ChartboxComponent } from './chartbox/chartbox.component';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";

@NgModule({
  declarations: [LoadingComponent, ChartboxComponent],
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MaterialModule,
    FaIconComponent,
  ],
  exports: [LoadingComponent, ChartboxComponent],
})
export class SharedModule {}
