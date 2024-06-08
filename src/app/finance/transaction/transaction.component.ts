import {Component, inject, OnInit} from '@angular/core';
import {LoadingService} from "../../shared/loading/loading.service";

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrl: './transaction.component.css',
})
export class FinanceComponent implements OnInit{
  loadingService = inject(LoadingService);
  ngOnInit(): void {
    this.loadingService.loadingOn()
  }
}
