import {Component, inject, OnInit} from '@angular/core';
import {MonthlyTransaction} from "../../model/transactions";
import {SessionService} from "../../service/session.service";
import {DataService} from "../../service/data.service";
import {LoadingService} from "../../../shared/loading/loading.service";

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.css'
})
export class PaymentsComponent implements OnInit{

  private sessionService = inject(SessionService);
  private dataService = inject(DataService)
  private loadingService = inject(LoadingService);

  sessionData = this.sessionService.getData();
  transactionData: MonthlyTransaction[] = [];

  ngOnInit(): void {
    const data= this.sessionData.payments;
    data.forEach(x => {
      x.transactions_cp = JSON.parse(JSON.stringify(x.transactions));
    })
    this.dataService.updatedFilters$.subscribe((value) => {
      if(value) {
        this.filterData();
      }
    });
    this.transactionData = data;
  }

  filterData() {
    const currData = this.sessionService.filterTransactions('payments');
    this.transactionData = JSON.parse(JSON.stringify(currData));
    this.loadingService.loadingOff();
  }

}
