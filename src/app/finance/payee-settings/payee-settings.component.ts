import { Component, inject, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { DataService } from '../../service/data.service';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { MenuItem } from '../model/common';
import { SearchbarComponent } from '../../shared/searchbar/searchbar.component';
import { MatGridList, MatGridTile } from '@angular/material/grid-list';
import { ToolbarMenuComponent } from '../../shared/toolbar-menu/toolbar-menu.component';
import { LoadingComponent } from '../../shared/loading/loading.component';

@Component({
    selector: 'app-payee-settings',
    templateUrl: './payee-settings.component.html',
    styleUrl: './payee-settings.component.css',
    standalone: true,
    imports: [
        LoadingComponent,
        ToolbarMenuComponent,
        MatGridList,
        MatGridTile,
        SearchbarComponent,
        RouterOutlet,
    ],
})
export class PayeeSettingsComponent implements OnInit {
  activatedRoute = inject(ActivatedRoute);
  dataService = inject(DataService);
  title = inject(Title);
  menuItems: MenuItem[] = [
    { label: 'Payees', link: 'payees' },
    { label: 'Recurring Payments', link: 'recurring-payments' },
  ];

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ payeeData }) => {
      this.dataService.setPayees(payeeData.payees);
    });
  }
}
