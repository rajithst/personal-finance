import { Component } from '@angular/core';

@Component({
  selector: 'app-side-nav',
  template: `
    <mat-nav-list>
      <a *ngFor="let item of routes"  mat-list-item [routerLinkActive]="'active-link'" [routerLink]="['/', item.path]">
        <div class="link-items">
          <div class="link-icon"><mat-icon color="primary" class="sidenav-icon">{{ item.data.icon }}</mat-icon></div>
          <div class="link-text"><span>{{ item.data.text }}</span></div>
        </div>


      </a>
    </mat-nav-list>`,
  styleUrl: './side-nav.component.css'
})
export class SideNavComponent {

  routes =  [
    {
      path: 'dashboard',
      data: { icon: 'dashboard', text: 'Dashboard' }
    },
    {
      path: 'finance',
      data: { icon: 'sync_alt', text: 'Transactions' }
    },
    {
      path: 'investments',
      data: { icon: 'stacked_bar_chart', text: 'Investments' }
    },
  ];
}



@Component({
  selector: 'app-side-nav-closed',
  template: `
    <mat-nav-list>
      <a *ngFor="let item of routes"  mat-list-item [routerLinkActive]="'active-link'" [routerLink]="['/', item.path]">
        <div class="link-items">
          <div class="link-icon"><mat-icon color="primary" class="sidenav-icon">{{ item.data.icon }}</mat-icon></div>
        </div>

      </a>
    </mat-nav-list>`,
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavClosedComponent {
  routes =  [
    {
      path: 'dashboard',
      data: { icon: 'dashboard', text: 'Dashboard' }
    },
    {
      path: 'finance',
      data: { icon: 'sync_alt', text: 'Transactions' }
    },
    {
      path: 'investments',
      data: { icon: 'stacked_bar_chart', text: 'Investments' }
    },
  ];

}
