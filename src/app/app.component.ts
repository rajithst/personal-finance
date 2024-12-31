import { Component, computed, inject, signal } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { MatMenuTrigger, MatMenu, MatMenuItem } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { AuthStore } from './auth/auth.store';
import {INCOME} from "./finance/data/client.data";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [
    MatIconButton,
    MatIcon,
    MatMenuTrigger,
    MatMenu,
    MatMenuItem,
    RouterLink,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    RouterOutlet,
    SidenavComponent,
  ],
})
export class AppComponent {
  private readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);
  collapsed = signal(false);
  sidenavWith = computed(() => (this.collapsed() ? '60px' : '200px'));
  isLoggedIn = computed(() => this.authStore.isLoggedIn());
  currentUser = computed(() => this.authStore.user());

  logout() {
    this.authStore.logout();
    this.router.navigate(['/login']).then();
  }

  protected readonly INCOME = INCOME;
}
