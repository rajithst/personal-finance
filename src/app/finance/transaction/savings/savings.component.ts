import {Component, OnInit} from '@angular/core';
import { SessionService } from '../../service/session.service';
import {MonthlyTransaction} from "../../model/transactions";

@Component({
  selector: 'app-savings',
  templateUrl: './savings.component.html',
  styleUrl: './savings.component.css',
})
export class SavingsComponent implements OnInit{

  sessionData = this.sessionService.getData();
  transactionData: MonthlyTransaction[];

  constructor(private sessionService: SessionService) {}

  ngOnInit(): void {
    const data= this.sessionData.saving;
    data.forEach(x => {
      x.transactions_cp = JSON.parse(JSON.stringify(x.transactions));
    })
    this.transactionData = data;
  }
}
