import { Component, computed, inject, OnInit, signal } from '@angular/core';
import {
  MatTableDataSource,
  MatTable,
  MatColumnDef,
  MatHeaderCellDef,
  MatHeaderCell,
  MatCellDef,
  MatCell,
  MatHeaderRowDef,
  MatHeaderRow,
  MatRowDef,
  MatRow,
} from '@angular/material/table';
import { Payee, PayeeDetail } from '../../model/payee';
import { ActivatedRoute } from '@angular/router';
import { TransactionExpand } from '../../model/transactions';
import { PayeeEditComponent } from '../payee-edit/payee-edit.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { MatDivider } from '@angular/material/divider';
import {
  MatCard,
  MatCardHeader,
  MatCardTitle,
  MatCardContent,
} from '@angular/material/card';
import { DecimalPipe, DatePipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { ApiService } from '../../../core/api.service';
import { LoadingComponent } from '../../../components/loading/loading.component';
import { NorecordsComponent } from '../../../components/norecords/norecords.component';

@Component({
  selector: 'app-payee-detail',
  templateUrl: './payee-detail.component.html',
  styleUrl: './payee-detail.component.scss',
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
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
    MatIcon,
    MatIconButton,
    LoadingComponent,
    NorecordsComponent,
  ],
})
export class PayeeDetailComponent implements OnInit {
  payeeInfo = signal<Payee | null>(null);
  payeeTransactions = signal<TransactionExpand[]>([]);
  totalPayment = computed(() => {
    return this.payeeTransactions().reduce(
      (acc, cur) => acc + (cur.amount ?? 0),
      0,
    );
  });
  loading = computed(() => this.payeeInfo() === null);
  noData = computed(() => !this.loading() && this.payeeInfo() === null);
  dataSource: MatTableDataSource<TransactionExpand>;
  displayedColumns: string[] = ['Date', 'Account', 'Amount', 'Notes'];
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly apiService = inject(ApiService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  ngOnInit(): void {
    this.getPayeeDetail().then();
  }

  async getPayeeDetail() {
    const payeeId = this.activatedRoute.snapshot.paramMap.get('id');
    const payeeName = this.activatedRoute.snapshot.paramMap.get('name');
    let payeeDetail: PayeeDetail | null = null;
    if (payeeId) {
      payeeDetail = await this.apiService.getPayeeDetail(payeeId);
    } else if (payeeName) {
      payeeDetail = await this.apiService.getPayeeDetailByName(payeeName);
    }
    console.log(payeeDetail);
    this.setDataSource(payeeDetail);
  }

  setDataSource(payeeDetail: PayeeDetail | null) {
    if (!payeeDetail) {
      return;
    }
    this.payeeInfo.set(payeeDetail.payee);
    this.payeeTransactions.set(payeeDetail.transactions);
    this.dataSource = new MatTableDataSource<TransactionExpand>(
      this.payeeTransactions(),
    );
  }

  editPayee() {
    const dialog = this.dialog.open(PayeeEditComponent, {
      maxWidth: '900px',
      position: {
        top: '5%',
      },
      data: { payee: this.payeeInfo() },
    });
    dialog
      .afterClosed()
      .subscribe(
        (result: PayeeDetail | null ) => {
          if (result) {
            this.setDataSource(result);
            this.snackBar.open('Updated!', 'Success', {
              duration: 3000,
            });
          } else if (result !== undefined) {
            this.snackBar.open('Failed!', 'Error', {
              duration: 3000,
            });
          }
        },
      );
  }
}
