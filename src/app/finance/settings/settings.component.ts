import {Component, inject, OnInit} from '@angular/core';
import { MatTabLink, MatTabNav, MatTabNavPanel } from '@angular/material/tabs';
import {Router, RouterLink, RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
  imports: [MatTabLink, MatTabNav, MatTabNavPanel, RouterLink, RouterOutlet],
})
export class SettingsComponent implements OnInit {
  private readonly router = inject(Router);
  tabs = [
    { label: 'Category Settings', route: 'category' },
    { label: 'Account settings', route: 'credit-accounts' },
    { label: 'Activity log', route: 'activity-log' },
  ];
  activeLink = this.tabs[0];

  ngOnInit(): void {
    const currentPath = this.router.url.split('/').at(-1);
    this.activeLink = this.tabs.find((tab) => tab.route === currentPath) || this.tabs[0];
  }
}
