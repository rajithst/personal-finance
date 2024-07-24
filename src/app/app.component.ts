import {Component, inject, OnInit, ViewChild} from '@angular/core';
import {MatSidenav, MatSidenavContainer} from "@angular/material/sidenav";
import {LoadingService} from "./shared/loading/loading.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  @ViewChild(MatSidenavContainer) sidenavContainer!: MatSidenavContainer;
  @ViewChild('snav') sideNav!: MatSidenav;
  loadingService = inject(LoadingService)
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
    this.loadingService.loadingOn()
  }
}
