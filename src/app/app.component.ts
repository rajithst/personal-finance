import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatSidenav, MatSidenavContainer } from '@angular/material/sidenav';
import { LoadingService } from './shared/loading/loading.service';
import { faList, faPerson } from '@fortawesome/free-solid-svg-icons';
import { ApiService } from './core/api.service';
import { DataService } from './finance/service/data.service';

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

  loadingService = inject(LoadingService);
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
    this.loadInitSettings();
    this.loadingService.loadingOn();
  }

  private loadInitSettings(): void {
    this.apiService.initSettings().subscribe((value) => {
      console.log(value);
      this.dataService.setClientSettings(value);
    });
  }
}
