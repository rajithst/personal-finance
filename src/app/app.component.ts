import { Component, computed, inject, signal } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { AuthService } from './auth/auth.service';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatMenuTrigger, MatMenu, MatMenuItem } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { SidenavComponent } from './components/sidenav/sidenav.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [
    NgIf,
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
  authService = inject(AuthService);

  collapsed = signal(false);
  sidenavWith = computed(() => (this.collapsed() ? '60px' : '200px'));
}
