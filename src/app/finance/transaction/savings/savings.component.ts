import {Component, inject, OnInit} from '@angular/core';
import { SessionService } from '../../service/session.service';
import {MonthlyTransaction} from "../../model/transactions";
import {DataService} from "../../service/data.service";
import {LoadingService} from "../../../shared/loading/loading.service";

@Component({
  selector: 'app-savings',
  templateUrl: './savings.component.html',
  styleUrl: './savings.component.css',
})
export class SavingsComponent implements OnInit{

  private sessionService = inject(SessionService);
  private dataService = inject(DataService)
  private loadingService = inject(LoadingService);

  sessionData = this.sessionService.getData();
  transactionData: MonthlyTransaction[];


  ngOnInit(): void {
    const data= this.sessionData.saving;
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
    const currData = this.sessionService.filterTransactions('savings');
    this.transactionData = JSON.parse(JSON.stringify(currData));
    this.loadingService.loadingOff();
  }
}
