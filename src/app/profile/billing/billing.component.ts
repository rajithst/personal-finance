import { Component } from '@angular/core';
import {
  MatCard,
  MatCardHeader,
  MatCardTitle,
  MatCardContent,
} from '@angular/material/card';

@Component({
    selector: 'app-billing',
    templateUrl: './billing.component.html',
    styleUrl: './billing.component.scss',
    imports: [MatCard, MatCardHeader, MatCardTitle, MatCardContent]
})
export class BillingComponent {}
