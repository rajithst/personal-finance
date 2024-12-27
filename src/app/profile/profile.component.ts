import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
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
  imports: [
    MatSidenavContainer,
    MatSidenav,
    MatNavList,
    MatSidenavContent,
    RouterOutlet,
  ],
})
export class ProfileComponent {}
