import {Component, inject, OnInit} from '@angular/core';
import {MonthlyTransaction} from "../../model/transactions";
import {DataService} from "../../service/data.service";

@Component({
  selector: 'app-incomes',
  templateUrl: './incomes.component.html',
  styleUrl: './incomes.component.css'
})
export class IncomesComponent implements OnInit{

  dataService = inject(DataService);
  transactionData: MonthlyTransaction[];


  ngOnInit(): void {
  }



}
