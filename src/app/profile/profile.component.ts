import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { DataService } from '../service/data.service';
import { MatNavList } from '@angular/material/list';
import {
  MatSidenavContainer,
  MatSidenav,
  MatSidenavContent,
} from '@angular/material/sidenav';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  standalone: true,
  imports: [
    MatSidenavContainer,
    MatSidenav,
    MatNavList,
    MatSidenavContent,
    RouterOutlet,
  ],
})
export class ProfileComponent implements OnInit {
  activatedRoute = inject(ActivatedRoute);
  dataService = inject(DataService);

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ myAccount }) => {
      this.dataService.setMyProfile(myAccount);
    });
  }
}
