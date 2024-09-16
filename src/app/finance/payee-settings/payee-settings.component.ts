import { Component, inject, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { DataService } from '../../service/data.service';
import { ActivatedRoute } from '@angular/router';
import { MenuItem } from '../../model/common';

@Component({
  selector: 'app-payee-settings',
  templateUrl: './payee-settings.component.html',
  styleUrl: './payee-settings.component.css',
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
