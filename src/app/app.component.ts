import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatSidenavContainer } from '@angular/material/sidenav';
import {
  faGear,
  faList,
  faSignOut,
  faUserCircle,
} from '@fortawesome/free-solid-svg-icons';
import { ApiService } from './core/api.service';
import { DataService } from './service/data.service';
import { AuthService } from './auth/auth.service';
import {
  animate,
  style,
  transition,
  trigger,
  state,
} from '@angular/animations';

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
})
export class AppComponent implements OnInit {
  @ViewChild(MatSidenavContainer) sidenavContainer!: MatSidenavContainer;
  authService = inject(AuthService);
  apiService = inject(ApiService);
  dataService = inject(DataService);

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

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.loadInitSettings();
    }
  }

  logout() {
    this.authService.logout().then((r) => {
      console.log(r);
    });
  }

  private loadInitSettings(): void {
    this.apiService.initSettings().subscribe((value) => {
      this.dataService.setClientSettings(value);
    });
  }
}
