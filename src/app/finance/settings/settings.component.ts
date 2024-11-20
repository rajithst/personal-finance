import { Component, inject, OnInit } from '@angular/core';
import {ActivatedRoute, RouterLink, RouterOutlet} from '@angular/router';
import { DataService } from '../../service/data.service';
import { MatNavList } from '@angular/material/list';
import { MatSidenavContainer, MatSidenav, MatSidenavContent } from '@angular/material/sidenav';
import {MatTabLink, MatTabNav, MatTabNavPanel} from "@angular/material/tabs";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
  standalone: true,
  imports: [
    MatSidenavContainer,
    MatSidenav,
    MatNavList,
    MatSidenavContent,
    RouterOutlet,
    MatTabLink,
    MatTabNav,
    MatTabNavPanel,
    RouterLink,
  ],
})
export class SettingsComponent implements OnInit {
  activatedRoute = inject(ActivatedRoute);
  dataService = inject(DataService);
  tabs = [
    { label: 'Category Settings', route: 'category' },
    { label: 'Account settings', route: 'credit-accounts' },
    { label: 'Activity log', route: 'activity-log' },
  ];
  activeLink = this.tabs[0];

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ settings }) => {
      this.dataService.setClientSettings(settings);
    });
  }
}
