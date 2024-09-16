import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../service/data.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  activatedRoute = inject(ActivatedRoute);
  dataService = inject(DataService);

  menuItems = [
    { name: 'Basic Info', link: 'me' },
    { name: 'Account Security', link: 'security' },
    { name: 'Billing', link: 'billing' },
  ];

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ myAccount }) => {
      this.dataService.setMyProfile(myAccount);
    });
  }
}
