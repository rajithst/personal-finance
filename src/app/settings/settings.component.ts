import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../service/data.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
})
export class SettingsComponent implements OnInit {
  activatedRoute = inject(ActivatedRoute);
  dataService = inject(DataService);

  menuItems = [
    { name: 'Category settings', link: 'category-settings' },
    { name: 'Accounts', link: 'accounts' },
    { name: 'Logs', link: 'user-log' },
  ];

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ settings }) => {
      this.dataService.setClientSettings(settings);
    });
  }
}
