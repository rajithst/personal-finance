import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { DataService } from '../service/data.service';
import { MatNavList } from '@angular/material/list';
import { MatSidenavContainer, MatSidenav, MatSidenavContent } from '@angular/material/sidenav';

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
    ],
})
export class SettingsComponent implements OnInit {
  activatedRoute = inject(ActivatedRoute);
  dataService = inject(DataService);

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ settings }) => {
      this.dataService.setClientSettings(settings);
    });
  }
}
