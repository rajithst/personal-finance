import { Component, computed, inject, signal } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import {
  faGear,
  faList,
  faSignOut,
  faUserCircle,
} from '@fortawesome/free-solid-svg-icons';
import { AuthService } from './auth/auth.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatMenuTrigger, MatMenu, MatMenuItem } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { NgIf, NgStyle } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { LoadingComponent } from './shared/loading/loading.component';
import { MatListModule } from '@angular/material/list';
import { SidenavComponent } from './components/sidenav/sidenav.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
  imports: [
    NgIf,
    MatIconButton,
    MatIcon,
    MatMenuTrigger,
    MatMenu,
    MatMenuItem,
    RouterLink,
    FaIconComponent,
    MatToolbarModule,
    LoadingComponent,
    MatSidenavModule,
    MatListModule,
    NgStyle,
    RouterOutlet,
    SidenavComponent,
  ],
})
export class AppComponent {
  authService = inject(AuthService);
  protected readonly faList = faList;
  protected readonly faSignOut = faSignOut;
  protected readonly faUserCircle = faUserCircle;
  protected readonly faGear = faGear;

  collapsed = signal(false);
  sidenavWith = computed(() => (this.collapsed() ? '60px' : '200px'));
}
