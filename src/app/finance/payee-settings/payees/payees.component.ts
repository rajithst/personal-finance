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
  MatNoDataRow,
} from '@angular/material/table';
import { Payee, PayeeDetail, PayeeFilter } from '../../model/payee';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SelectionModel } from '@angular/cdk/collections';
import { PayeeEditComponent } from '../payee-edit/payee-edit.component';
import { ReplaySubject, takeUntil } from 'rxjs';
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
import { MatIconButton, MatMiniFabButton } from '@angular/material/button';
import { LoadingComponent } from '../../../components/loading/loading.component';
import { FinanceStore } from '../../../core/store/finance.store';
import { NorecordsComponent } from '../../../components/norecords/norecords.component';
import { MatTooltip } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { SearchBarComponent } from '../../../components/search-bar/search-bar.component';
import { DataService } from '../../../service/data.service';
import { TransactionFilterComponent } from '../../../components/transaction-filter/transaction-filter.component';

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
    FormsModule,
    SearchBarComponent,
    MatNoDataRow,
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
  filterParams = this.getEmptyFilterParams();
  protected readonly destroyed$ = new ReplaySubject<void>(1);
  protected readonly TRANSACTION_TYPE_SAVINGS_ID = TRANSACTION_TYPE_SAVINGS_ID;
  protected readonly TRANSACTION_TYPE_PAYMENTS_ID =
    TRANSACTION_TYPE_PAYMENTS_ID;
  protected readonly TRANSACTION_TYPE_EXPENSE_ID = TRANSACTION_TYPE_EXPENSE_ID;
  protected readonly TRANSACTION_TYPE_INCOME_ID = TRANSACTION_TYPE_INCOME_ID;
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  private readonly store = inject(FinanceStore);
  private readonly dataService = inject(DataService);

  payees = signal<Payee[] | null>(null);
  loading = computed(() => this.payees() === null);
  noData = computed(() => !this.loading() && this.payees()?.length === 0);

  ngOnInit(): void {
    this.preparePayeeTable().then();

    this.dataService.search$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((value) => {
        if (value !== null) {
          this.filterParams.query = value ?? '';
          this.applyFiltersToTable();
        }
      });
  }

  async preparePayeeTable() {
    await this.store.getPayees();
    this.payees.set(this.store.payees() ?? []);
    this.dataSource = new MatTableDataSource<Payee>(this.payees() ?? []);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.dataSource.filterPredicate = this.createFilterPredicate();
    this.applyFiltersToTable();
  }

  private applyFiltersToTable() {
    this.dataSource.filterPredicate = this.createFilterPredicate();
    this.dataSource.filter = JSON.stringify(this.filterParams).trim();
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
    dialog.afterClosed().subscribe((result: PayeeDetail | null | undefined) => {
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

  openFilters() {
    this.dialog.closeAll();
    const dialog = this.dialog.open(TransactionFilterComponent, {
      maxWidth: '800px',
      hasBackdrop: true,
      data: { filterParams: this.filterParams, hiddenSections: ['accounts'] },
    });

    dialog.afterClosed().subscribe((result) => {
      if (result) {
        this.filterParams = {
          target: result.filters.target,
          categories: result.filters.categories,
          subcategories: result.filters.subcategories,
          payees: result.filters.payees,
          query: result.filters.query,
        };
        this.applyFiltersToTable();
      }
    });
  }

  private createFilterPredicate(): (data: Payee, filter: string) => boolean {
    return (data: Payee, filter: string): boolean => {
      const filterObject: PayeeFilter = JSON.parse(filter);
      console.log('Evaluating row:', data, 'with filter:', filterObject);
      let categoryIncludes = false;
      let subCategoryIncludes = false;
      let payeeIncludes = true;
      const c1 =
        filterObject.categories?.length === 0 &&
        filterObject.subcategories?.length === 0;
      const c2 =
        filterObject.categories?.length === 0 &&
        filterObject.subcategories?.length !== 0;
      const c3 =
        filterObject.categories?.length !== 0 &&
        filterObject.subcategories?.length === 0;
      const c4 =
        filterObject.categories?.length !== 0 &&
        filterObject.subcategories?.length !== 0;
      if (data.category != null && filterObject.categories != null) {
        categoryIncludes = filterObject.categories.includes(data.category);
      }
      if (data.subcategory != null && filterObject.subcategories != null) {
        subCategoryIncludes = filterObject.subcategories.includes(
          data.subcategory,
        );
      }
      if (data.id != null && filterObject.payees && filterObject.payees.length > 0) {
        payeeIncludes = filterObject.payees.includes(data.id);
      }
      const filterQuery = filterObject.query ? filterObject.query : '';
      let [q1, q2, q3, q4] = [true, true, true, true];
      if (filterQuery) {
        q1 = data.destination.toLowerCase().includes(filterQuery.toLowerCase());
        q2 =
          data.destination_eng
            ?.toLowerCase()
            .includes(filterQuery.toLowerCase()) || false;
        q3 =
          data.category_text
            ?.toLowerCase()
            .includes(filterQuery.toLowerCase()) || false;
        q4 =
          data.subcategory_text
            ?.toLowerCase()
            .includes(filterQuery.toLowerCase()) || false;
      }

      return (
        (c1 ||
          (c2 && subCategoryIncludes) ||
          (c3 && categoryIncludes) ||
          (c4 && (categoryIncludes || subCategoryIncludes))) &&
        (q1 || q2 || q3 || q4) &&
        payeeIncludes
      );
    };
  }

  private getEmptyFilterParams(): PayeeFilter {
    return {
      query: '',
      target: '',
      categories: [],
      subcategories: [],
      payees: [],
    };
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
    this.dataService.setSearchQuery('');
  }
}
