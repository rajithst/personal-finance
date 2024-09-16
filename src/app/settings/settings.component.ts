import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../service/data.service';
import { faGear, faList, faUser } from '@fortawesome/free-solid-svg-icons';
import { MenuItem } from '../model/common';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
})
export class SettingsComponent implements OnInit {
  activatedRoute = inject(ActivatedRoute);
  dataService = inject(DataService);

  menuItems: MenuItem[] = [
    { label: 'Category settings', link: 'category-settings', icon: faGear },
    { label: 'Accounts', link: 'accounts', icon: faUser },
    { label: 'Logs', link: 'user-log', icon: faList },
  ];

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ settings }) => {
      this.dataService.setClientSettings(settings);
    });
  }
}
