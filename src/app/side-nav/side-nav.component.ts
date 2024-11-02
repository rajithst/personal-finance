import { Component } from '@angular/core';
import {
  faChartLine,
  faChartSimple,
  faMoneyBillTransfer,
  faPieChart,
  faShop,
} from '@fortawesome/free-solid-svg-icons';
import {MenuItem} from "../finance/model/common";
import { NavItemComponent } from '../shared/nav-item/nav-item.component';
import { MatNavList } from '@angular/material/list';

@Component({
    selector: 'app-side-nav',
    template: ` <mat-nav-list>
    <app-nav-item [menuItems]="menuItems"></app-nav-item>
  </mat-nav-list>`,
    styleUrl: './side-nav.component.css',
    standalone: true,
    imports: [MatNavList, NavItemComponent],
})
export class SideNavComponent {

  menuItems: MenuItem[] = [
    {label: 'Dashboard', link:'/dashboard', icon: faChartSimple},
    {label: 'Transactions', link:'/finance', icon: faMoneyBillTransfer},
    {label: 'Payee Settings', link:'/payee-settings', icon: faShop},
    {label: 'Reports', link:'/reports', icon: faPieChart},
    {label: 'Investments', link:'/investments', icon: faChartLine}
  ]
}

