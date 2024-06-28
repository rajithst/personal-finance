import {Component, inject, OnInit} from '@angular/core';
import {SessionService} from "../../service/session.service";
import {MonthlyTransaction} from "../../model/transactions";
import {DataService} from "../../service/data.service";

@Component({
  selector: 'app-incomes',
  templateUrl: './incomes.component.html',
  styleUrl: './incomes.component.css'
})
export class IncomesComponent implements OnInit{

  dataService = inject(DataService);
  sessionData = this.sessionService.getData();
  transactionData: MonthlyTransaction[];

  constructor(private sessionService: SessionService) {}

  ngOnInit(): void {
    this.dataService.setBulkSelectTransactions([]);
    const data= this.sessionData.incomes
    data.forEach(x => {
      x.transactions_cp = JSON.parse(JSON.stringify(x.transactions));
    })
    this.transactionData = data;
  }



}
