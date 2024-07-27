import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { MaterialModule } from '../../shared/material.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PayeeEditComponent } from './payee-edit/payee-edit.component';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { PayeeRulesComponent } from './payee-rules.component';
import { PayeeRulesRoutingModule } from './payee-rules.routing.module';

@NgModule({
  declarations: [PayeeRulesComponent, PayeeEditComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MaterialModule,
    FontAwesomeModule,
    PayeeRulesRoutingModule,
  ],
  providers: [
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: {
        width: '850px',
        position: {
          top: '10%',
        },
      },
    },
  ],
})
export class PayeeRulesModuleModule {}
