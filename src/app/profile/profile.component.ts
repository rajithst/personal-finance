import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { MatTabLink, MatTabNav, MatTabNavPanel } from '@angular/material/tabs';

@Component({
  selector: 'app-profile',
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
  imports: [RouterOutlet, MatTabLink, MatTabNav, RouterLink, MatTabNavPanel],
})
export class ProfileComponent implements OnInit {
  private readonly router = inject(Router);
  tabs = [
    { label: 'Profile', route: 'me' },
    { label: 'Security', route: 'security' },
    { label: 'Billing', route: 'billing' },
  ];
  activeLink = this.tabs[0];

  ngOnInit(): void {
    const currentPath = this.router.url.split('/').at(-1);
    this.activeLink =
      this.tabs.find((tab) => tab.route === currentPath) || this.tabs[0];
  }
}
