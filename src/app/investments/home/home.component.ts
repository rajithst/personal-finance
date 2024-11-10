import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import {MatTabLink, MatTabNav, MatTabNavPanel} from "@angular/material/tabs";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    MatTabLink,
    MatTabNav,
    MatTabNavPanel,
  ],
})
export class HomeComponent implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  tabs = [
    { label: 'Dashboard', route: '' },
    { label: 'Portfolio', route: 'income' },
    { label: 'Payments', route: 'payment' },
    { label: 'Savings', route: 'saving' },
  ];
  activeLink = this.tabs[0];
  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ investments }) => {});
  }
}
