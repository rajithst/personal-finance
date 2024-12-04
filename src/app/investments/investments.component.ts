import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatTabLink, MatTabNav, MatTabNavPanel } from '@angular/material/tabs';
import { MatButton } from '@angular/material/button';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { ApiService } from '../core/api.service';
import { PortfolioService } from './service/portfolio.service';
import { Portfolio } from './model/portfolio';

@Component({
  selector: 'app-investments',
  template: `
    <div class="main-toolbar">
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
      <div class="toolbar-actions">
        <button mat-flat-button color="primary" [matMenuTriggerFor]="menu">
          Switch Portfolio
        </button>
        <mat-menu #menu="matMenu">
          <button mat-menu-item>Create new portfolio</button>
          @for (portfolio of myPortfolios; track portfolio.id) {
            <button mat-menu-item>{{ portfolio.name }}</button>
          }
        </mat-menu>
      </div>
    </div>
    <mat-tab-nav-panel #tabPanel>
      <router-outlet></router-outlet>
    </mat-tab-nav-panel>
  `,
  styles: `
    .main-toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .toolbar-actions {
      display: flex;
      flex-direction: row;
      > button {
        margin: 0 5px;
      }
    }
    div[mat-tab-group] {
      flex-grow: 1;
    }
  `,
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    MatTabLink,
    MatTabNav,
    MatTabNavPanel,
    MatButton,
    MatMenu,
    MatMenuTrigger,
    MatMenuItem,
  ],
})
export class InvestmentsComponent {
  tabs = [
    { label: 'Portfolio', route: 'portfolio' },
    { label: 'Holdings', route: 'holdings' },
    { label: 'Dividends', route: 'dividends' },
    { label: 'Purchase History', route: 'purchase-history' },
  ];
  activeLink = this.tabs[0];
  myPortfolios: Portfolio[] = [];
  private readonly portfolioService = inject(PortfolioService);

  constructor() {
    const apiService = inject(ApiService);
    apiService.getPortfolios().subscribe((portfolios) => {
      this.portfolioService.setPortfolios(portfolios);
      this.myPortfolios = portfolios;
    });
  }
}
