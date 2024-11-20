import { Component, inject, OnInit, signal } from '@angular/core';
import { MatTableDataSource, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';
import { DestinationMap } from '../../model/payee';
import { ActivatedRoute } from '@angular/router';
import { TransactionExpand } from '../../model/transactions';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import { PayeeEditComponent } from '../payee-edit/payee-edit.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { MatDivider } from '@angular/material/divider';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent } from '@angular/material/card';
import { NgIf, DecimalPipe, DatePipe } from '@angular/common';

@Component({
    selector: 'app-payee-detail',
    templateUrl: './payee-detail.component.html',
    styleUrl: './payee-detail.component.scss',
    standalone: true,
    imports: [
        NgIf,
        MatCard,
        MatCardHeader,
        MatCardTitle,
        FaIconComponent,
        MatCardContent,
        MatDivider,
        MatTable,
        MatSort,
        MatColumnDef,
        MatHeaderCellDef,
        MatHeaderCell,
        MatSortHeader,
        MatCellDef,
        MatCell,
        MatHeaderRowDef,
        MatHeaderRow,
        MatRowDef,
        MatRow,
        DecimalPipe,
        DatePipe,
    ],
})
export class PayeeDetailComponent implements OnInit {
  payeeInfo: DestinationMap;
  payeeTransactions: TransactionExpand[];
  totalPayment = signal(0);
  lastMonthPayment = signal(0);
  dataSource: MatTableDataSource<TransactionExpand>;
  displayedColumns: string[] = ['Date', 'Account', 'Amount', 'Notes'];
  protected readonly faPencil = faPencil;
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ payee }) => {
      this.payeeInfo = payee.payee;
      this.payeeTransactions = payee.transactions;
      this.totalPayment.set(
        this.payeeTransactions.reduce(
          (total, item) => total + (item.amount ?? 0),
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
      maxWidth: '900px',
      position: {
        top: '5%',
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
          if (result?.payee) {
            this.payeeInfo = result.payee;
            this.snackBar.open('Updated!', 'Success', {
              duration: 3000,
            });
          }
        },
      );
  }
}
