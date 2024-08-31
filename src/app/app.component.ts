import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatSidenav, MatSidenavContainer } from '@angular/material/sidenav';
import {faGear, faList, faPerson, faSignOut, faUserCircle} from '@fortawesome/free-solid-svg-icons';
import { ApiService } from './core/api.service';
import { DataService } from './finance/service/data.service';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  @ViewChild(MatSidenavContainer) sidenavContainer!: MatSidenavContainer;
  @ViewChild('snav') sideNav!: MatSidenav;
  protected readonly faList = faList;
  protected readonly faPerson = faPerson;

  authService = inject(AuthService);
  apiService = inject(ApiService);
  dataService = inject(DataService);

  sideNavDefaultOpened = true;
  showFullMenu = true;
  isExpanded = true;
  closedWidth = 60;
  openedWidth = 200;
  sideNavMode: 'side' | 'over' = 'side';
  hasBackdrop: boolean = false;

  onToolbarMenuToggle() {
    this.showFullMenu = !this.isExpanded;
    this.isExpanded = !this.isExpanded;
  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.loadInitSettings();
    }
  }

  private loadInitSettings(): void {
    this.apiService.initSettings().subscribe((value) => {
      this.dataService.setClientSettings(value);
    });
  }

  logout() {
    this.authService.logout().then((r) => {
      console.log(r);
    });
  }

  protected readonly faSignOut = faSignOut;
  protected readonly faUserCircle = faUserCircle;
  protected readonly faGear = faGear;
}
