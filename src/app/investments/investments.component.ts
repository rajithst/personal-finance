import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { MatTabLink, MatTabNav, MatTabNavPanel } from '@angular/material/tabs';
import { MatButton } from '@angular/material/button';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { Portfolio } from './model/portfolio';
import { InvestmentStore } from '../core/store/investment.store';
import { MatIcon } from '@angular/material/icon';
import { DataService } from '../service/data.service';
import { NewPortfolioComponent } from './portfolio/new-portfolio/new-portfolio.component';
import { MatDialog } from '@angular/material/dialog';

const DIALOG_WIDTH = '900px';
const DIALOG_TOP_POSITION = '5%';

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
        <button mat-stroked-button color="primary" [matMenuTriggerFor]="menu">
          <mat-icon>arrow_drop_down</mat-icon>

          {{ store.currentPortfolio()?.name || 'Select Portfolio'}}
        </button>
        <mat-menu #menu="matMenu">
          <button mat-menu-item (click)="createNewPortfolio()">
            <mat-icon>add</mat-icon>
            <span>Create new portfolio</span>
          </button>
          @for (portfolio of store.portfolios(); track portfolio.id) {
            <button mat-menu-item (click)="switchPortfolio(portfolio.id)">
              <mat-icon>attach_money</mat-icon>
              <span>{{ portfolio.name }}</span>
            </button>
          }
        </mat-menu>
      </div>
    </div>
    <mat-tab-nav-panel #tabPanel>
      @if (store.portfolios().length === 0) {
        <div class="no-portfolio">
          <p>You don't have any portfolios yet.</p>
          <button mat-raised-button color="primary" (click)="createNewPortfolio()">
            Create new portfolio
          </button>
        </div>
      } @else {
        <router-outlet></router-outlet>
      }
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
    .no-portfolio {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 50%;
    }
  `,
  imports: [
    RouterLink,
    RouterOutlet,
    MatTabLink,
    MatTabNav,
    MatTabNavPanel,
    MatButton,
    MatMenu,
    MatIcon,
    MatMenuTrigger,
    MatMenuItem,
  ],
})
export class InvestmentsComponent implements OnInit {
  store = inject(InvestmentStore);
  private readonly router = inject(Router);
  private readonly dataService = inject(DataService);
  private readonly dialog = inject(MatDialog);

  tabs = [
    { label: 'Portfolio', route: 'portfolio' },
    { label: 'Holdings', route: 'holdings' , },
    { label: 'Dividends', route: 'dividends', subPaths: ['history'] },
    { label: 'Purchase History', route: 'purchase-history' },
  ];

  subPaths = [

  ]
  activeLink = { label: '', route: '' };

  ngOnInit() {
    const currentPath = this.router.url.split('/').at(-1);
    this.activeLink =
      this.tabs.find((tab) => tab.route === currentPath || tab?.subPaths?.includes(currentPath ?? '')) || this.tabs[0];
  }

  async switchPortfolio(id: number) {
    const switched = await this.store.switchPortfolio(id);
    if (!switched) {
      return;
    }
    this.dataService.setPortfolioSwitch(id);
  }

  createNewPortfolio() {
    const dialog = this.dialog.open(NewPortfolioComponent, {
      maxWidth: DIALOG_WIDTH,
      position: {
        top: DIALOG_TOP_POSITION,
      },
    });
    dialog.afterClosed().subscribe((result: Portfolio | null) => {
      if (result) {
        this.switchPortfolio(result.id).then();
      }
    });
  }
}
