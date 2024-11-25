import { Component, inject, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { DataService } from '../../service/data.service';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { MatGridList, MatGridTile } from '@angular/material/grid-list';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { MatTabLink, MatTabNav, MatTabNavPanel } from '@angular/material/tabs';

@Component({
  selector: 'app-payee-settings',
  templateUrl: './payee-settings.component.html',
  styleUrl: './payee-settings.component.scss',
  standalone: true,
  imports: [
    LoadingComponent,
    MatGridList,
    MatGridTile,
    RouterOutlet,
    MatTabLink,
    MatTabNav,
    RouterLink,
    MatTabNavPanel,
  ],
})
export class PayeeSettingsComponent implements OnInit {
  activatedRoute = inject(ActivatedRoute);
  dataService = inject(DataService);
  title = inject(Title);
  tabs = [
    { label: 'All Payees', route: 'payees' },
    { label: 'Recurring Payees', route: 'recurring-payments' },
  ];
  activeLink = this.tabs[0];

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ payeeData }) => {
      this.dataService.setPayees(payeeData.payees);
    });
  }
}
