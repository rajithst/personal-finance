import { Component, inject, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { MatTabLink, MatTabNav, MatTabNavPanel } from '@angular/material/tabs';

@Component({
  selector: 'app-investments',
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
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    MatTabLink,
    MatTabNav,
    MatTabNavPanel,
  ],
})
export class InvestmentsComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  tabs = [
    { label: 'Portfolio', route: 'portfolio' },
    { label: 'Holdings', route: 'holdings' },
    { label: 'Dividends', route: 'dividends' },
    { label: 'Purchase History', route: 'purchase-history' },
  ];
  activeLink = this.tabs[0];
  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ investments }) => {});
  }
}
