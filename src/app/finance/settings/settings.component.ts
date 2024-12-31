import {Component, inject, OnInit} from '@angular/core';
import { MatTabLink, MatTabNav, MatTabNavPanel } from '@angular/material/tabs';
import {Router, RouterLink, RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-settings',
  template: `
    <nav mat-tab-nav-bar mat-stretch-tabs="false" [tabPanel]="tabPanel">
      @for (link of tabs; track link) {
        <a
          mat-tab-link
          [routerLink]="link.route"
          (click)="activeLink = link"
          [active]="activeLink == link"
        >
          {{ link.label }}
        </a>
      }
    </nav>
    <mat-tab-nav-panel #tabPanel>
      <router-outlet></router-outlet>
    </mat-tab-nav-panel>
  `,
  styles: ``,
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
