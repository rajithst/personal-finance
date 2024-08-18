import { Component, inject, OnInit, signal } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DestinationMap } from '../../model/payee';
import { ActivatedRoute } from '@angular/router';
import { TransactionExpand } from '../../model/transactions';

@Component({
  selector: 'app-payee-detail',
  templateUrl: './payee-detail.component.html',
  styleUrl: './payee-detail.component.css',
})
export class PayeeDetailComponent implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  payeeInfo: DestinationMap;
  payeeTransactions: TransactionExpand[];
  totalPayment = signal(0);
  lastMonthPayment = signal(0);
  dataSource: MatTableDataSource<TransactionExpand>;
  displayedColumns: string[] = ['Date', 'Account', 'Amount', 'Notes'];
  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ payee }) => {
      this.payeeInfo = payee.payee;
      this.payeeTransactions = payee.transactions;
      this.totalPayment.set(
        this.payeeTransactions.reduce(
          (total, item) => total + (item.amount === null ? 0 : item.amount),
          0,
        ),
      );
      this.dataSource = new MatTableDataSource<TransactionExpand>(
        this.payeeTransactions,
      );
    });
  }
}
