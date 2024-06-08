import {Component, OnInit} from '@angular/core';
import {MonthlyTransaction} from "../../model/transactions";
import {SessionService} from "../../service/session.service";

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.css'
})
export class PaymentsComponent implements OnInit{

  sessionData = this.sessionService.getData();
  transactionData: MonthlyTransaction[];

  constructor(private sessionService: SessionService) {}

  ngOnInit(): void {
    const data= this.sessionData.payments;
    data.forEach(x => {
      x.transactions_cp = JSON.parse(JSON.stringify(x.transactions));
    })
    this.transactionData = data;
  }

}
