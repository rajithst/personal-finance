import {
  Component,
  computed,
  ElementRef,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import {
  MonthlyTransaction,
  TransactionExpand,
  TransactionFilter,
} from '../../model/transactions';
import {
  TransactionDeleteDialog,
  TransactionUpdateDialog,
} from '../transaction-update/transaction-update.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  faCirclePlus,
  faCodeMerge,
  faEdit,
  faEllipsisV,
  faExpand,
  faEye,
  faEyeSlash,
  faFilter,
  faLink,
  faList,
  faMinimize,
  faPencil,
  faScissors,
  faTrash,
  faUpload,
} from '@fortawesome/free-solid-svg-icons';
import { MatTableDataSource } from '@angular/material/table';
import { DataService } from '../../service/data.service';
import { SelectionModel } from '@angular/cdk/collections';
import { MatAccordion } from '@angular/material/expansion';
import { TransactionFilterComponent } from '../transaction-filter/transaction-filter.component';
import { LoadingService } from '../../../shared/loading/loading.service';
import { Sort } from '@angular/material/sort';
import { ERROR_ACTION, SUCCESS_ACTION } from '../../../data/client.data';
import { Router } from '@angular/router';
import { ReplaySubject, takeUntil } from 'rxjs';
import { faChartColumn } from '@fortawesome/free-solid-svg-icons/faChartColumn';
import { TransactionSplitComponent } from '../transaction-split/transaction-split.component';
import { TransactionBulkEditComponent } from '../transaction-bulk-edit/transaction-bulk-edit.component';
import {
  Account,
  TransactionCategory,
  TransactionSubCategory,
} from '../../model/common';
import { TransactionImportComponent } from '../transaction-import/transaction-import.component';
import { INCOME } from '../../../data/shared.data';

interface TransactionActionResult {
  refresh: boolean;
  data: TransactionExpand | TransactionExpand[] | null;
  action: string;
}

interface FilterParamChip {
  id: number;
  type: string;
  name: string | undefined;
}
@Component({
  selector: 'app-transaction-table',
  templateUrl: './transaction-table.component.html',
  styleUrl: './transaction-table.component.css',
})
export class TransactionTableComponent implements OnInit, OnChanges, OnDestroy {
  @Input() transactions: MonthlyTransaction[];
  @Input() transactionType: string;
  accordion = viewChild.required(MatAccordion);
  filterButton = viewChild<ElementRef>('filterButton');

  protected readonly faTrash = faTrash;
  protected readonly faEdit = faEdit;
  protected readonly faList = faList;
  protected readonly faScissors = faScissors;
  protected readonly faEllipsisV = faEllipsisV;
  protected readonly faPencil = faPencil;
  protected readonly faCodeMerge = faCodeMerge;
  protected readonly faCirclePlus = faCirclePlus;
  protected readonly faExpand = faExpand;
  protected readonly faMinimize = faMinimize;
  protected readonly faUpload = faUpload;
  protected readonly faFilter = faFilter;
  protected readonly faChartColumn = faChartColumn;
  protected readonly faLink = faLink;
  protected readonly faEye = faEye;
  protected readonly faEyeSlash = faEyeSlash;
  protected readonly destroyed$ = new ReplaySubject<void>(1);

  private router = inject(Router);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private loadingService = inject(LoadingService);
  private dataService = inject(DataService);

  ACCOUNTS: Account[] = this.dataService.getAccounts();
  TRANSACTION_SUB_CATEGORIES: TransactionSubCategory[] =
    this.dataService.getAllSubCategories();
  TRANSACTION_CATEGORIES: TransactionCategory[] =
    this.dataService.getAllCategories();

  showValues = false;

  totalAnnualAmount = signal<number>(0);
  segments = signal(this.router.url.split('/'));
  lastSegment = computed(() => {
    const segmentLength = this.segments().length;
    return this.segments().at(segmentLength - 1);
  });
  selection = new SelectionModel<TransactionExpand>(true, []);
  allDataSource: MatTableDataSource<TransactionExpand>[] = [];
  allTransactions: MonthlyTransaction[] = [];
  bulkSelectedTableIndex: number = -1;
  allExpanded = false;

  filterParams = this.getEmptyFilterParams();
  filterParamChips: FilterParamChip[] = [];
  displayedColumns: string[] = [
    'select',
    'Date',
    'Account',
    'Destination',
    'Category',
    'SubCategory',
    'Amount',
    'Notes',
    'Actions',
  ];

  ngOnInit(): void {
    this.dataService.yearSwitch$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((value) => {
        this.filterParams.year = value;
        this.createFilterChips();
      });

    this.dataService.valueVisibility$.subscribe((value) => {
      this.showValues = value;
    });
    this.dataService.searchBar$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((value) => {
        this.filterParams.query = value ? value.trim() : '';
        this.applyFiltersToTables();
      });
  }

  ngOnChanges() {
    this.allTransactions =
      this.transactions.length > 0 ? this.transactions : [];
    this.totalAnnualAmount.set(0);
    this.allTransactions.forEach((x: MonthlyTransaction, index: number) => {
      this.allDataSource.splice(
        index,
        0,
        new MatTableDataSource<TransactionExpand>(x.transactions),
      );
      this.allDataSource[index].filterPredicate = this.createFilterPredicate();
      this.totalAnnualAmount.update(
        (x) => x + this.allTransactions[index].total,
      );
    });
    this.createFilterChips();
    this.applyFiltersToTables();
  }

  editTransaction(item: TransactionExpand) {
    const dialog = this.dialog.open(TransactionUpdateDialog, {
      data: { formData: item, task: 'edit' },
    });

    dialog.afterClosed().subscribe((result: TransactionActionResult) => {
      if (result.action === SUCCESS_ACTION) {
        const responseData = result.data as TransactionExpand;
        let targetTableIndex = this.getTableIndexFromTransaction(responseData);
        this.updateInAllTransactions(targetTableIndex, responseData);
        this.refreshUpdatedDataSourceTable(targetTableIndex);
        this.snackBar.open('Updated!', 'Success', {
          duration: 3000,
        });
      } else if (result.action === ERROR_ACTION) {
        this.snackBar.open('Failed to update!', 'Error', {
          duration: 3000,
        });
      }
    });
  }

  deleteTransaction(item: TransactionExpand) {
    const dialog = this.dialog.open(TransactionDeleteDialog, {
      data: { formData: item, task: 'delete' },
    });
    dialog.afterClosed().subscribe((result: TransactionActionResult) => {
      if (result.action === SUCCESS_ACTION) {
        const responseData = result.data as TransactionExpand;
        let targetTableIndex = this.getTableIndexFromTransaction(responseData);
        this.removeFromTransactions(targetTableIndex, [responseData.id!]);
        this.refreshUpdatedDataSourceTable(targetTableIndex);
        this.snackBar.open('Deleted!', 'Success', {
          duration: 3000,
        });
      } else if (result.action === ERROR_ACTION) {
        this.snackBar.open('Failed to delete!', 'Error', {});
      }
    });
  }

  addTransaction() {
    const dialog = this.dialog.open(TransactionUpdateDialog, {
      data: { formData: null, task: 'add' },
    });
    dialog.afterClosed().subscribe((result: TransactionActionResult) => {
      if (result.action === SUCCESS_ACTION) {
        const responseData = result.data as TransactionExpand;
        let targetTableIndex = this.getTableIndexFromTransaction(responseData);
        if (targetTableIndex === -1) {
          this.insertNewTransactionToDataSource(responseData);
          targetTableIndex = this.getTableIndexFromTransaction(responseData);
        } else {
          this.updateInAllTransactions(targetTableIndex, responseData);
        }
        this.refreshUpdatedDataSourceTable(targetTableIndex);
        this.snackBar.open('Added Successfully!', 'Success', {
          duration: 3000,
        });
      } else if (result.action === ERROR_ACTION) {
        this.snackBar.open('Failed to add!', 'Error', {
          duration: 3000,
        });
      }
    });
  }

  mergeTransactions() {
    const formData = JSON.parse(JSON.stringify(this.selection.selected[0]));
    if (!formData) return;
    formData.amount = this.selection.selected.reduce(
      (total, item) => total + (item.amount === null ? 0 : item.amount),
      0,
    );
    formData.is_merge = true;
    const mergeIds = this.selection.selected
      .filter((x) => x.id !== formData.id)
      .map((x) => x.id);
    if (!mergeIds) return;

    const dialog = this.dialog.open(TransactionUpdateDialog, {
      data: {
        formData: formData,
        task: 'merge',
        mergeIds: mergeIds,
      },
    });
    dialog.afterClosed().subscribe((result: TransactionActionResult) => {
      if (result.action === SUCCESS_ACTION) {
        const responseData = result.data as TransactionExpand;
        const targetTableIndex =
          this.getTableIndexFromTransaction(responseData);
        this.removeFromTransactions(targetTableIndex, mergeIds as number[]);
        this.updateInAllTransactions(targetTableIndex, responseData);
        this.refreshUpdatedDataSourceTable(targetTableIndex);
        this.selection.clear();
        this.snackBar.open('Updated!', 'Success', {
          duration: 3000,
        });
      } else if (result.action === ERROR_ACTION) {
        this.selection.clear();
        this.snackBar.open('Failed to merge!', 'Error', {});
      }
    });
  }

  splitTransaction(item: TransactionExpand, tableIndex: number) {
    const dialog = this.dialog.open(TransactionSplitComponent, {
      data: {
        formData: item,
      },
    });
    dialog.afterClosed().subscribe((result: TransactionActionResult) => {
      if (result.action === SUCCESS_ACTION) {
        const responseData = result.data as TransactionExpand[];
        const targetTableIndex = this.getTableIndexFromTransaction(item);
        responseData.forEach((updatedTransaction) => {
          this.updateInAllTransactions(targetTableIndex, updatedTransaction);
        });
        this.refreshUpdatedDataSourceTable(targetTableIndex);
        this.snackBar.open('Updated!', 'Success', {
          duration: 3000,
        });
      } else if (result.action === ERROR_ACTION) {
        this.snackBar.open('Failed to split!', 'Error', {
          duration: 3000,
        });
      }
    });
  }

  bulkEditTransactions() {
    const dialog = this.dialog.open(TransactionBulkEditComponent, {
      data: {
        formData: this.selection.selected,
        task: 'edit',
      },
    });
    dialog.afterClosed().subscribe((result: TransactionExpand | null) => {});
  }

  bulkDeleteTransactions() {
    const dialog = this.dialog.open(TransactionBulkEditComponent, {
      data: {
        formData: this.selection.selected,
        task: 'delete',
      },
    });
    dialog.afterClosed().subscribe((result: TransactionActionResult) => {
      if (result.action === SUCCESS_ACTION) {
        const responseData = result.data as TransactionExpand[];
        const tempTransaction = responseData[0];
        const deleteIds = responseData.map((x) => x.id as number);
        const targetTableIndex =
          this.getTableIndexFromTransaction(tempTransaction);
        this.removeFromTransactions(targetTableIndex, deleteIds);
        this.refreshUpdatedDataSourceTable(targetTableIndex);
        this.selection.clear();
        this.bulkSelectedTableIndex = -1;
      }
    });
  }

  showPayeeDetail(destination: string) {
    const url = this.router.serializeUrl(
      this.router.createUrlTree([`/payee-settings/${destination}`]),
    );
    window.open(url, '_blank');
  }

  importTransaction() {
    const dialog = this.dialog.open(TransactionImportComponent);
    dialog.afterClosed().subscribe((result: TransactionActionResult) => {
      if (result.action === SUCCESS_ACTION) {
        this.snackBar.open('Imported Successfully!.', 'Success', {
          duration: 3000,
        });
        this.dataService.setRefresh(true);
      }
    });
  }

  showAnalytics(tableIndex: number) {}

  private removeFromTransactions(tableIndex: number, deleteIds: number[]) {
    if (tableIndex !== -1) {
      this.allTransactions[tableIndex].transactions = this.allTransactions[
        tableIndex
      ].transactions.filter((x) => !deleteIds.includes(x.id!));
    }
  }

  private refreshUpdatedDataSourceTable(tableIndex: number) {
    const dataSource = new MatTableDataSource<TransactionExpand>(
      this.allTransactions[tableIndex].transactions,
    );
    dataSource.filterPredicate = this.createFilterPredicate();
    dataSource.filter = JSON.stringify(this.filterParams).trim();
    if (tableIndex < this.allDataSource.length) {
      this.allDataSource[tableIndex] = dataSource;
    } else {
      this.allDataSource.push(dataSource);
    }
    this.allTransactions[tableIndex].total = dataSource.filteredData.reduce(
      (total, item) => total + (item.amount === null ? 0 : item.amount),
      0,
    );
    this.totalAnnualAmount.set(0);
    this.allTransactions.forEach((table) => {
      this.totalAnnualAmount.update((x) => x + table.total);
    });
  }

  private updateInAllTransactions(
    tableIndex: number,
    newTransaction: TransactionExpand,
  ) {
    let childIndex = -1;
    if (tableIndex !== -1) {
      const transactions = this.allTransactions[tableIndex].transactions;
      childIndex = transactions.findIndex((x) => x.id === newTransaction.id);
      if (childIndex !== -1) {
        if (newTransaction.is_deleted) {
          this.allTransactions[tableIndex].transactions = this.allTransactions[
            tableIndex
          ].transactions.filter((x) => x.id !== newTransaction.id);
        } else {
          this.allTransactions[tableIndex].transactions[childIndex] =
            newTransaction;
        }
      } else {
        this.allTransactions[tableIndex].transactions.push(newTransaction);
      }
    }
  }

  private insertNewTransactionToDataSource(newTransaction: TransactionExpand) {
    const transactionItem: MonthlyTransaction = {
      year: newTransaction.year,
      month: newTransaction.month,
      month_text: newTransaction.month_text,
      total: newTransaction.amount || 0,
      transactions: [newTransaction],
    };
    this.allTransactions.push(transactionItem);
  }

  private getTableIndexFromTransaction(newTransaction: TransactionExpand) {
    const year = newTransaction.year;
    const month = newTransaction.month;
    return this.allTransactions.findIndex(
      (x) => x.year === year && x.month === month,
    );
  }

  private applyFiltersToTables() {
    const filters = this.filterParams;
    this.totalAnnualAmount.set(0);
    this.allDataSource.forEach((y) => {
      y.filter = JSON.stringify(filters).trim();
    });
    let tableIndex = 0;
    this.allTransactions.forEach((x: MonthlyTransaction) => {
      x.total = this.allDataSource[tableIndex].filteredData.reduce(
        (a, b) => a + b.amount!,
        0,
      );
      this.totalAnnualAmount.update((y) => y + x.total);
      tableIndex += 1;
    });
  }

  private createFilterPredicate(): (
    data: TransactionExpand,
    filter: string,
  ) => boolean {
    return (data: TransactionExpand, filter: string): boolean => {
      const filterObject: TransactionFilter = JSON.parse(filter);
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
      const categoryIncludes = filterObject.categories?.includes(data.category);
      const subCategoryIncludes = filterObject.subcategories?.includes(
        data.subcategory,
      );
      const paymentMethodIncludes =
        filterObject.accounts?.length !== 0
          ? filterObject.accounts?.includes(data.account)
          : true;
      const filterQuery = filterObject.query ? filterObject.query : '';
      const q1 = data.destination
        .toLowerCase()
        .includes(filterQuery.toLowerCase());
      const q2 = data.alias.toLowerCase().includes(filterQuery.toLowerCase());
      const q3 = data.category_text
        .toLowerCase()
        .includes(filterQuery.toLowerCase());
      const q4 = data.subcategory_text
        .toLowerCase()
        .includes(filterQuery.toLowerCase());
      const q5 = data.account_name
        .toLowerCase()
        .includes(filterQuery.toLowerCase());

      return <boolean>(
        (data.year === filterObject.year &&
          (c1 ||
            (c2 && subCategoryIncludes) ||
            (c3 && categoryIncludes) ||
            (c4 && (categoryIncludes || subCategoryIncludes))) &&
          paymentMethodIncludes &&
          (q1 || q2 || q3 || q4 || q5))
      );
    };
  }

  private getEmptyFilterParams(): TransactionFilter {
    return {
      query: '',
      year: this.dataService.getFilterYear(),
      target: this.lastSegment() || '',
      categories: [],
      subcategories: [],
      accounts: [],
    };
  }

  isAllSelected(tableIndex: number) {
    const numSelected = this.selection.selected.length;
    const numRows = this.allDataSource[tableIndex].data.length;
    return numSelected === numRows;
  }

  toggleAllRows(tableIndex: number) {
    if (this.isAllSelected(tableIndex)) {
      this.selection.clear();
      this.bulkSelectedTableIndex = -1;
    } else {
      this.selection.select(...this.allDataSource[tableIndex].data);
      this.bulkSelectedTableIndex = tableIndex;
    }
  }

  toggleRow(row: TransactionExpand, tableIndex: number) {
    this.selection.toggle(row);
    this.bulkSelectedTableIndex = tableIndex;
  }

  openFilters() {
    this.dialog.closeAll();
    const rect = this.filterButton()?.nativeElement.getBoundingClientRect();
    const dialog = this.dialog.open(TransactionFilterComponent, {
      width: '700px',
      height: '500px',
      position: { top: `${rect.bottom + 10}px`, right: `20px` },
      hasBackdrop: true,
      data: { filterParams: this.filterParams },
    });

    dialog.afterClosed().subscribe((result) => {
      if (result) {
        this.filterParams = {
          year: result.filters.year,
          target: result.filters.target,
          categories: result.filters.categories,
          subcategories: result.filters.subcategories,
          accounts: result.filters.accounts,
        };
        this.createFilterChips();
        this.applyFiltersToTables();
        this.loadingService.loadingOff();
      }
    });
  }

  panelAction() {
    this.allExpanded = !this.allExpanded;
    if (this.allExpanded) {
      this.accordion().openAll();
    } else {
      this.accordion().closeAll();
    }
  }

  showValueAction() {
    this.showValues = !this.showValues;
    this.dataService.setValueVisibility(this.showValues);
  }

  removeChip(chip: any) {
    if (chip.type === 'category') {
      this.filterParams.categories = this.filterParams.categories?.filter(
        (y) => y !== chip.id,
      );
    } else if (chip.type === 'subcategory') {
      this.filterParams.subcategories = this.filterParams.subcategories?.filter(
        (y) => y !== chip.id,
      );
    } else if (chip.type === 'account') {
      this.filterParams.accounts = this.filterParams.accounts?.filter(
        (y) => y !== chip.id,
      );
    }
    this.createFilterChips();
    this.applyFiltersToTables();
  }

  createFilterChips() {
    const categoryChips = this.filterParams.categories?.map((x) => ({
      id: x,
      type: 'category',
      name: this.TRANSACTION_CATEGORIES.find((y) => y.id === x)?.category,
    }));
    const subCategoryChips = this.filterParams.subcategories?.map((x) => ({
      id: x,
      type: 'subcategory',
      name: this.TRANSACTION_SUB_CATEGORIES.find((y) => y.id === x)?.name,
    }));
    const accountChips = this.filterParams.accounts?.map((x) => ({
      id: x,
      type: 'account',
      name: this.ACCOUNTS.find((y) => y.id === x)?.account_name,
    }));
    this.filterParamChips = [
      ...categoryChips!,
      ...subCategoryChips!,
      ...accountChips!,
    ];
  }

  onSortData(sort: Sort, tableIndex: number) {
    let data = this.allDataSource[tableIndex].data;
    if (sort.active && sort.direction !== '') {
      data = data.sort((a: TransactionExpand, b: TransactionExpand) => {
        const isAsc = sort.direction === 'asc';
        switch (sort.active) {
          case 'PaymentMethod':
            return this.compare(a.account_name, b.account_name, isAsc);
          case 'Date':
            return this.compare(a.date, b.date, isAsc);
          case 'Destination':
            return this.compare(a.destination, b.destination, isAsc);
          case 'Category':
            return this.compare(+a.category_text, +b.category_text, isAsc);
          case 'SubCategory':
            return this.compare(
              +a.subcategory_text,
              +b.subcategory_text,
              isAsc,
            );
          case 'Amount':
            return this.compare(+a.amount!, +b.amount!, isAsc);
          default:
            return 0;
        }
      });
    }

    const dataSource = new MatTableDataSource<TransactionExpand>(data);
    dataSource.filterPredicate = this.createFilterPredicate();
    dataSource.filter = JSON.stringify(this.filterParams).trim();
    this.allDataSource[tableIndex] = dataSource;
  }

  private compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  protected readonly INCOME = INCOME;
}
