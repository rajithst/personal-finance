import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from './loading/loading.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MaterialModule } from './material.module';
import { ChartboxComponent } from './chartbox/chartbox.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { RouterModule } from '@angular/router';
import { SearchbarComponent } from './searchbar/searchbar.component';
import { ToolbarMenuComponent } from './toolbar-menu/toolbar-menu.component';
import { NavItemComponent } from './nav-item/nav-item.component';

@NgModule({
  declarations: [
    LoadingComponent,
    ChartboxComponent,
    SearchbarComponent,
    ToolbarMenuComponent,
    NavItemComponent,
  ],
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MaterialModule,
    FaIconComponent,
    RouterModule,
  ],
  exports: [
    LoadingComponent,
    ChartboxComponent,
    SearchbarComponent,
    ToolbarMenuComponent,
    NavItemComponent,
  ],
})
export class SharedModule {}
