import { Component, inject, OnInit, signal } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DestinationMap } from '../../model/payee';
import { ActivatedRoute } from '@angular/router';
import { TransactionExpand } from '../../model/transactions';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import { PayeeEditComponent } from '../payee-edit/payee-edit.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-payee-detail',
  templateUrl: './payee-detail.component.html',
  styleUrl: './payee-detail.component.css',
})
export class PayeeDetailComponent implements OnInit {
  protected readonly faPencil = faPencil;
  private activatedRoute = inject(ActivatedRoute);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

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

  editPayee() {
    const dialog = this.dialog.open(PayeeEditComponent, {
      width: '850px',
      height: '600px',
      position: {
        top: '100px',
      },
      data: { payee: this.payeeInfo },
    });
    dialog
      .afterClosed()
      .subscribe(
        (result: {
          payee: DestinationMap | null;
          mergeIds: number[] | null;
        }) => {
          if (result.payee) {
            this.payeeInfo = result.payee;
            this.snackBar.open('Updated!', 'Success', {
              duration: 3000,
            });
          }
        },
      );
  }
}
