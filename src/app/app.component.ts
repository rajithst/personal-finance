import {Component, ViewChild} from '@angular/core';
import { SessionService } from './finance/service/session.service';
import {
  faMoneyBillTrendUp,
  faMoneyBillTransfer,
} from '@fortawesome/free-solid-svg-icons';
import {MatSidenav, MatSidenavContainer} from "@angular/material/sidenav";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  investmentIcon = faMoneyBillTrendUp;
  financeIcon = faMoneyBillTransfer;
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
  constructor(private sessionService: SessionService) {
    this.sessionService.refresh();
  }

  onToolbarMenuToggle() {
    if (this.isMobile) {
      this.sideNav.toggle();
    } else {
      this.showFullMenu = !this.isExpanded;
    }
    this.isExpanded = !this.isExpanded;
  }
}
