import {Component, OnInit} from '@angular/core';
import {SessionService} from "../../service/session.service";
import {MonthlyTransaction} from "../../model/transactions";

@Component({
  selector: 'app-incomes',
  templateUrl: './incomes.component.html',
  styleUrl: './incomes.component.css'
})
export class IncomesComponent implements OnInit{

  sessionData = this.sessionService.getData();
  transactionData: MonthlyTransaction[];

  constructor(private sessionService: SessionService) {}

  ngOnInit(): void {
    const data= this.sessionData.incomes
    data.forEach(x => {
      x.transactions_cp = JSON.parse(JSON.stringify(x.transactions));
    })
    this.transactionData = data;
  }



}
