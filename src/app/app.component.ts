import { Component, inject, ViewChild } from '@angular/core';
import {
  MatSidenavContainer,
  MatSidenavModule,
} from '@angular/material/sidenav';
import {
  faGear,
  faList,
  faSignOut,
  faUserCircle,
} from '@fortawesome/free-solid-svg-icons';
import { AuthService } from './auth/auth.service';
import {
  animate,
  style,
  transition,
  trigger,
  state,
} from '@angular/animations';
import { SideNavComponent } from './side-nav/side-nav.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatMenuTrigger, MatMenu, MatMenuItem } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { NgIf, NgStyle } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import {LoadingComponent} from "./shared/loading/loading.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  animations: [
    trigger('inOutAnimation', [
      state(
        'open',
        style({
          width: '200px',
          opacity: 1,
        }),
      ),
      state(
        'closed',
        style({
          width: '60px',
          opacity: 1,
        }),
      ),
      transition('* => closed', [animate('0.2s')]),
      transition('* => open', [animate('0.2s')]),
    ]),
  ],
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
    NgStyle,
    SideNavComponent,
    RouterOutlet,
  ],
})
export class AppComponent {
  @ViewChild(MatSidenavContainer) sidenavContainer!: MatSidenavContainer;
  authService = inject(AuthService);

  sideNavDefaultOpened = true;
  showFullMenu = true;
  isExpanded = true;
  closedWidth = 60;
  openedWidth = 200;
  sideNavMode: 'side' | 'over' = 'side';
  protected readonly faList = faList;
  protected readonly faSignOut = faSignOut;
  protected readonly faUserCircle = faUserCircle;
  protected readonly faGear = faGear;

  onToolbarMenuToggle() {
    this.showFullMenu = !this.isExpanded;
    this.isExpanded = !this.isExpanded;
  }
}
