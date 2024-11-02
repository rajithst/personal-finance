import { Component } from '@angular/core';
import { MenuItem } from '../model/common';
import { RouterOutlet } from '@angular/router';
import { ToolbarMenuComponent } from '../../shared/toolbar-menu/toolbar-menu.component';

@Component({
    selector: 'app-reports',
    templateUrl: './reports.component.html',
    styleUrl: './reports.component.css',
    standalone: true,
    imports: [ToolbarMenuComponent, RouterOutlet],
})
export class ReportsComponent {
  menuItems: MenuItem[] = [
    { label: 'Expense', link: 'analytics' },
    { label: 'Income', link: 'analytics' },
    { label: 'Cashflow', link: 'analytics' },
  ];
}
