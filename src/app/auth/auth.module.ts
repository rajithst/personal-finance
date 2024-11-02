import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login.component';

import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
    imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    LoginComponent,
],
})
export class AuthModule {}
