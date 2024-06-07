import { Component } from '@angular/core';
import { SessionService } from '../../service/session.service';
import {MonthlyTransaction} from "../../model/transactions";

@Component({
  selector: 'app-savings',
  templateUrl: './savings.component.html',
  styleUrl: './savings.component.css',
})
export class SavingsComponent {
  sessionData = this.sessionService.getData();
  transactionData: MonthlyTransaction[] = this.sessionData.saving;

  constructor(private sessionService: SessionService) {}
}
