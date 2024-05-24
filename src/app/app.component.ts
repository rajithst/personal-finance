import { Component } from '@angular/core';
import { SessionService } from './finance/service/session.service';
import {
  faMoneyBillTrendUp,
  faMoneyBillTransfer,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  investmentIcon = faMoneyBillTrendUp;
  financeIcon = faMoneyBillTransfer;
  constructor(private sessionService: SessionService) {
    this.sessionService.refresh();
  }
}
