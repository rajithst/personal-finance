import {Component, computed, Input, signal} from '@angular/core';
import { MatListModule, MatNavList } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { NgIf } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NavItemComponent } from '../nav-item/nav-item.component';

export interface MenuItem {
  display_name: string;
  route?: string;
  label?: string;
  icon?: any;
  children?: MenuItem[];
}

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
  standalone: true,
  imports: [
    MatNavList,
    MatListModule,
    MatIconModule,
    NgIf,
    RouterLinkActive,
    RouterLink,
    NavItemComponent,
  ],
})
export class SidenavComponent {
  sideNavCollapsed = signal(false);
  @Input() set collapsed(value: boolean) {
    this.sideNavCollapsed.set(value);
  }
  logoHeight = computed(() => this.sideNavCollapsed() ? '32': '100');
  logoWidth = computed(() => this.sideNavCollapsed() ? '32': '180');
  menuItems = signal<MenuItem[]>([
    {
      display_name: 'Dashboard',
      route: 'dashboard',
      icon: 'dashboard',
    },
    {
      display_name: 'Finance',
      route: '/finance',
      icon: 'assured_workload',
    },
    {
      display_name: 'Payee Settings',
      route: '/payee-settings',
      icon: 'store',
    },
    {
      display_name: 'Reports',
      route: '/reports',
      icon: 'pie_chart',
    },
    {
      display_name: 'Investments',
      route: '/investments',
      icon: 'query_stats',
    },
    {
      display_name: 'Settings',
      route: '/finance-settings',
      icon: 'settings',
    },
  ]);
}
