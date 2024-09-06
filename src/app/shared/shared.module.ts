import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from './loading/loading.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MaterialModule } from './material.module';
import { ChartboxComponent } from './chartbox/chartbox.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { RouterModule } from '@angular/router';
@NgModule({
  declarations: [LoadingComponent, ChartboxComponent, BreadcrumbComponent],
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MaterialModule,
    FaIconComponent,
    RouterModule
  ],
  exports: [LoadingComponent, ChartboxComponent, BreadcrumbComponent],
})
export class SharedModule {}
