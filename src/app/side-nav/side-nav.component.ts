import { Component } from '@angular/core';
import {faChartLine, faChartSimple, faMoneyBillTransfer, faSackDollar, faShop} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-side-nav',
  template: `
    <mat-nav-list>
      <a mat-list-item [routerLinkActive]="'active-link'" [routerLink]="['/', 'dashboard']">
        <div class="link-items">
          <div class="link-icon">
            <fa-icon [icon]="faChartSimple" size="lg" [style]="{'color': '#3699ff'}"></fa-icon>
          </div>
          <div class="link-text"><span>Dashboard</span></div>
        </div>
      </a>
      <a mat-list-item [routerLinkActive]="'active-link'" [routerLink]="['/', 'finance']">
        <div class="link-items">
          <div class="link-icon">
            <fa-icon [icon]="faMoneyBillTransfer" size="lg" [style]="{'color': '#3699ff'}"></fa-icon>
          </div>
          <div class="link-text"><span>Transactions</span></div>
        </div>
      </a>
      <a mat-list-item [routerLinkActive]="'active-link'" [routerLink]="['/', 'payee-rules']">
        <div class="link-items">
          <div class="link-icon">
            <fa-icon [icon]="faShop" size="lg" [style]="{'color': '#3699ff'}"></fa-icon>
          </div>
          <div class="link-text"><span>Payee Settings</span></div>
        </div>
      </a>
      <a mat-list-item [routerLinkActive]="'active-link'" [routerLink]="['/', 'investments']">
        <div class="link-items">
          <div class="link-icon">
            <fa-icon [icon]="faChartLine" size="lg" [style]="{'color': '#3699ff'}"></fa-icon>
          </div>
          <div class="link-text"><span>Investments</span></div>
        </div>
      </a>
    </mat-nav-list>`,
  styleUrl: './side-nav.component.css'
})
export class SideNavComponent {
  protected readonly faSackDollar = faSackDollar;
  protected readonly faChartSimple = faChartSimple;
  protected readonly faMoneyBillTransfer = faMoneyBillTransfer;
  protected readonly faShop = faShop;
  protected readonly faChartLine = faChartLine;
}



@Component({
  selector: 'app-side-nav-closed',
  template: `
    <mat-nav-list>
      <a mat-list-item
         [routerLinkActive]="'active-link'"
         [routerLink]="['/', 'dashboard']"
         matTooltip="Dashboard"
         matTooltipPosition="right">
        <div class="link-items">
          <div class="link-icon">
            <fa-icon [icon]="faChartSimple" size="lg" [style]="{'color': '#3699ff'}"></fa-icon>
          </div>
        </div>
      </a>
      <a mat-list-item
         [routerLinkActive]="'active-link'"
         [routerLink]="['/', 'finance']"
         matTooltip="Transactions"
         matTooltipPosition="right">
        <div class="link-items">
          <div class="link-icon">
            <fa-icon [icon]="faMoneyBillTransfer" size="lg" [style]="{'color': '#3699ff'}"></fa-icon>
          </div>
        </div>
      </a>
      <a mat-list-item
         [routerLinkActive]="'active-link'"
         [routerLink]="['/', 'payee-rules']"
         matTooltip="Payee Settings"
         matTooltipPosition="right">
        <div class="link-items">
          <div class="link-icon">
            <fa-icon [icon]="faShop" size="lg" [style]="{'color': '#3699ff'}"></fa-icon>
          </div>
        </div>
      </a>
      <a mat-list-item
         [routerLinkActive]="'active-link'"
         [routerLink]="['/', 'investments']"
         matTooltip="Investments"
         matTooltipPosition="right">
        <div class="link-items">
          <div class="link-icon">
            <fa-icon [icon]="faChartLine" size="lg" [style]="{'color': '#3699ff'}"></fa-icon>
          </div>
        </div>
      </a>
    </mat-nav-list>\`,`,
  styleUrl: './side-nav.component.css'
})
export class SideNavClosedComponent {
  protected readonly faChartSimple = faChartSimple;
  protected readonly faMoneyBillTransfer = faMoneyBillTransfer;
  protected readonly faShop = faShop;
  protected readonly faChartLine = faChartLine;

}
