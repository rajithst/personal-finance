import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatTabLink, MatTabNav, MatTabNavPanel } from '@angular/material/tabs';

@Component({
    selector: 'app-reports',
    templateUrl: './reports.component.html',
    styleUrl: './reports.component.scss',
    imports: [RouterOutlet, MatTabLink, MatTabNav, RouterLink, MatTabNavPanel]
})
export class ReportsComponent {
  tabs = [
    { label: 'Analytics', route: 'analytics' },
    { label: 'Cash flow', route: 'analytics' },
  ];
  activeLink = this.tabs[0];
}
