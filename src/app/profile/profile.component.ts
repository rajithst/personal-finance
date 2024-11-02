import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { DataService } from '../service/data.service';
import { MenuItem } from '../finance/model/common';
import {
  faCreditCard,
  faUser,
  faWarning,
} from '@fortawesome/free-solid-svg-icons';
import { NavItemComponent } from '../shared/nav-item/nav-item.component';
import { MatNavList } from '@angular/material/list';
import { MatSidenavContainer, MatSidenav, MatSidenavContent } from '@angular/material/sidenav';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.css',
    standalone: true,
    imports: [
        MatSidenavContainer,
        MatSidenav,
        MatNavList,
        NavItemComponent,
        MatSidenavContent,
        RouterOutlet,
    ],
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
