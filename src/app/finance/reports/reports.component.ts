import { Component } from '@angular/core';
import { MenuItem } from '../../model/common';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css',
})
export class ReportsComponent {
  menuItems: MenuItem[] = [
    { label: 'Expense', link: 'analytics' },
    { label: 'Income', link: 'analytics' },
    { label: 'Cashflow', link: 'analytics' },
  ];
}
