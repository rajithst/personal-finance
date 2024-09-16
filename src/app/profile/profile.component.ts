import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../service/data.service';
import { MenuItem } from '../model/common';
import {
  faCreditCard,
  faUser,
  faWarning,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  activatedRoute = inject(ActivatedRoute);
  dataService = inject(DataService);

  menuItems: MenuItem[] = [
    { label: 'Basic Info', link: 'me', icon: faUser },
    { label: 'Account Security', link: 'security', icon: faWarning },
    { label: 'Billing', link: 'billing', icon: faCreditCard },
  ];

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ myAccount }) => {
      this.dataService.setMyProfile(myAccount);
    });
  }
}
