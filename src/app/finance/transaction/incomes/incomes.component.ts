import { Component } from '@angular/core';
import {SessionService} from "../../service/session.service";
import {MonthlyTransaction} from "../../model/transactions";

@Component({
  selector: 'app-incomes',
  templateUrl: './incomes.component.html',
  styleUrl: './incomes.component.css'
})
export class IncomesComponent {

  sessionData = this.sessionService.getData();
  transactionData: MonthlyTransaction[] = this.sessionData.incomes;

  constructor(private sessionService: SessionService) {}



}
