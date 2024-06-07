import { Component } from '@angular/core';
import {MonthlyTransaction} from "../../model/transactions";
import {SessionService} from "../../service/session.service";

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.css'
})
export class PaymentsComponent {
  sessionData = this.sessionService.getData();
  transactionData: MonthlyTransaction[] = this.sessionData.payments;

  constructor(private sessionService: SessionService) {}

}
