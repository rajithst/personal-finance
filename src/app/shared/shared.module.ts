import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LoadingComponent} from "./loading/loading.component";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import { MultiSelectDropDownComponent } from './ui-components/multi-select-drop-down/multi-select-drop-down.component';

@NgModule({
  declarations: [
    LoadingComponent,
    MultiSelectDropDownComponent,
  ],
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
  ],
  exports: [
    LoadingComponent,
    MultiSelectDropDownComponent
  ]
})
export class SharedModule {


}
