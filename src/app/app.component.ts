import {Component, ViewChild} from '@angular/core';
import {MatSidenav, MatSidenavContainer} from "@angular/material/sidenav";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  @ViewChild(MatSidenavContainer) sidenavContainer!: MatSidenavContainer;
  @ViewChild('snav') sideNav!: MatSidenav;
  sideNavDefaultOpened = true;
  showFullMenu = true;
  isExpanded = true;
  closedWidth = 70;
  openedWidth = 250;
  isMobile!: boolean;
  sideNavMode: 'side' | 'over' = 'side';
  hasBackdrop: boolean = false;
  toolBarHeight = 64;

  onToolbarMenuToggle() {
    if (this.isMobile) {
      this.sideNav.toggle();
    } else {
      this.showFullMenu = !this.isExpanded;
    }
    this.isExpanded = !this.isExpanded;
  }
}
