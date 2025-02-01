import {
  Component,
  computed,
  inject,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import {
  MatTable,
  MatTableDataSource,
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
import { Payee } from '../../model/payee';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SelectionModel } from '@angular/cdk/collections';
import { PayeeEditComponent } from '../payee-edit/payee-edit.component';
import { ReplaySubject } from 'rxjs';
import {
  TRANSACTION_TYPE_EXPENSE_ID,
  TRANSACTION_TYPE_INCOME_ID,
  TRANSACTION_TYPE_PAYMENTS_ID,
  TRANSACTION_TYPE_SAVINGS_ID,
} from '../../data/client.data';
import { MatChip } from '@angular/material/chips';
import { NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatIcon } from '@angular/material/icon';
import {MatIconButton, MatMiniFabButton} from '@angular/material/button';
import { LoadingComponent } from '../../../components/loading/loading.component';
import { FinanceStore } from '../../../core/store/finance.store';
import { NorecordsComponent } from '../../../components/norecords/norecords.component';
import {MatTooltip} from "@angular/material/tooltip";

@Component({
  selector: 'app-payees',
  templateUrl: './payees.component.html',
  styleUrl: './payees.component.scss',
  imports: [
    MatTable,
    MatSort,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCheckbox,
    MatCellDef,
    MatCell,
    MatSortHeader,
    RouterLink,
    NgIf,
    NgSwitch,
    NgSwitchCase,
    MatChip,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    MatPaginator,
    MatIcon,
    MatIconButton,
    LoadingComponent,
    NorecordsComponent,
    MatMiniFabButton,
    MatTooltip,
  ],
})
export class PayeesComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatTable) table: MatTable<Payee>;
  @ViewChild(MatSort) sort: MatSort;
  dataSource: MatTableDataSource<Payee>;
  selection = new SelectionModel<Payee>(true, []);
  displayedColumns: string[] = [
    'select',
    'Payee',
    'Alias',
    'Category',
    'CategoryType',
    'Actions',
  ];
  protected readonly destroyed$ = new ReplaySubject<void>(1);
  protected readonly TRANSACTION_TYPE_SAVINGS_ID = TRANSACTION_TYPE_SAVINGS_ID;
  protected readonly TRANSACTION_TYPE_PAYMENTS_ID =
    TRANSACTION_TYPE_PAYMENTS_ID;
  protected readonly TRANSACTION_TYPE_EXPENSE_ID = TRANSACTION_TYPE_EXPENSE_ID;
  protected readonly TRANSACTION_TYPE_INCOME_ID = TRANSACTION_TYPE_INCOME_ID;
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  private readonly store = inject(FinanceStore);

  payees = signal<Payee[] | null>(null);
  loading = computed(() => this.payees() === null);
  noData = computed(() => !this.loading() && this.payees()?.length === 0);

  ngOnInit(): void {
    this.preparePayeeTable().then();
  }

  async preparePayeeTable() {
    await this.store.getPayees();
    this.payees.set(this.store.payees() ?? []);
    this.dataSource = new MatTableDataSource<Payee>(this.payees() ?? []);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  editPayee(payee: Payee) {
    const dialog = this.dialog.open(PayeeEditComponent, {
      maxWidth: '900px',
      height: '70%',
      position: {
        top: '5%',
      },
      data: { payee },
    });
    dialog.afterClosed().subscribe((result: Payee | null | undefined) => {
      if (result !== undefined) {
        this.preparePayeeTable().then();
        const message = result ? 'Updated!' : 'Failed!';
        const action = result ? 'Success' : 'Error';
        this.snackBar.open(message, action, {
          duration: 3000,
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
