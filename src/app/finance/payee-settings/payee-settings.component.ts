import { Component, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatTabLink, MatTabNav, MatTabNavPanel } from '@angular/material/tabs';

@Component({
  selector: 'app-payee-settings',
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
export class PayeeSettingsComponent {
  title = inject(Title);
  tabs = [
    { label: 'All Payees', route: 'payees' },
    { label: 'Recurring Payees', route: 'recurring-payments' },
  ];
  activeLink = this.tabs[0];
}
