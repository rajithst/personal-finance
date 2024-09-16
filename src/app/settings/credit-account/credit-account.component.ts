import { Component, inject } from '@angular/core';
import { DataService } from '../../service/data.service';

@Component({
  selector: 'app-credit-account',
  templateUrl: './credit-account.component.html',
  styleUrl: './credit-account.component.css',
})
export class CreditAccountComponent {
  dataService = inject(DataService);
  accounts = this.dataService.getAccounts();
  displayedColumns = ['account_name', 'account_type', 'description'];
}
