import { Component } from '@angular/core';
import {MONTHS, PAYMENT_METHODS, TRANSACTION_CATEGORIES, YEARS} from "../../data/client.data";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

    protected readonly YEARS = YEARS;
    protected readonly MONTHS = MONTHS;
    protected readonly TRANSACTION_CATEGORIES = TRANSACTION_CATEGORIES;
    protected readonly PAYMENT_METHODS = PAYMENT_METHODS;
}
