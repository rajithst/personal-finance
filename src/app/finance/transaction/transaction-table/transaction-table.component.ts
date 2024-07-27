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
  faChartBar,
  faCirclePlus,
  faCodeMerge,
  faEdit,
  faEllipsisV,
  faExpand,
  faFilter,
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
import {
  INCOME_CATEGORIES,
  PAYMENT_CATEGORY_ID,
  SAVINGS_CATEGORY_ID,
  TRANSACTION_CATEGORIES,
  TRANSACTION_SUB_CATEGORIES,
} from '../../../data/client.data';
import { Router } from '@angular/router';
import { INCOME, PAYMENT, SAVING } from '../../../data/shared.data';
import { ReplaySubject, takeUntil } from 'rxjs';
import {faChartColumn} from "@fortawesome/free-solid-svg-icons/faChartColumn";

@Component({
  selector: 'app-transaction-table',
  templateUrl: './transaction-table.component.html',
  styleUrl: './transaction-table.component.css',
})
export class TransactionTableComponent implements OnInit, OnChanges, OnDestroy {
  @Input() transactions: MonthlyTransaction[];
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

  private router = inject(Router);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private loadingService = inject(LoadingService);
  private dataService = inject(DataService);

  protected readonly destroyed$ = new ReplaySubject<void>(1);

  totalAnnualAmount = signal<number>(0);
  segments = signal(this.router.url.split('/'));
  lastSegment = computed(() => {
    const segmentLength = this.segments().length;
    return this.segments().at(segmentLength - 1);
  });
  dataSource: MatTableDataSource<TransactionExpand>;
  selection = new SelectionModel<TransactionExpand>(true, []);
  allDataSource: MatTableDataSource<TransactionExpand>[] = [];
  allTransactions: MonthlyTransaction[] = [];
  bulkSelectedTableIndex: number = -1;
  allExpanded = false;

  filterParams = signal<TransactionFilter>(this.getEmptyFilterParams());
  filterParamChips = computed(() => {
    const getTargets = (targetId: number) => {
      if (this.filterParams().target === SAVING) {
        return TRANSACTION_SUB_CATEGORIES[SAVINGS_CATEGORY_ID].find(
          (y) => y.value === targetId,
        )?.viewValue;
      } else if (this.filterParams().target === PAYMENT) {
        return TRANSACTION_SUB_CATEGORIES[PAYMENT_CATEGORY_ID].find(
          (y) => y.value === targetId,
        )?.viewValue;
      } else {
        const allTransactionSubCategories = Object.values(
          TRANSACTION_SUB_CATEGORIES,
        ).flat();
        return allTransactionSubCategories.find((y) => y.value === targetId)
          ?.viewValue;
      }
    };
    const categoryChips = this.filterParams().categories?.map((x) => ({
      id: x,
      type: 'category',
      name:
        this.filterParams().target === INCOME
          ? INCOME_CATEGORIES.find((y) => y.value === x)?.viewValue
          : TRANSACTION_CATEGORIES.find((y) => y.value === x)?.viewValue,
    }));
    const subCategoryChips = this.filterParams().subcategories?.map((x) => ({
      id: x,
      type: 'subcategory',
      name: getTargets(x),
    }));
    return [...categoryChips!, ...subCategoryChips!];
  });
  displayedColumns: string[] = [
    'select',
    'Date',
    'PaymentMethod',
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
        this.filterParams.update((x) => {
          return {
            year: value,
            target: x.target,
            categories: x.categories,
            subcategories: x.subcategories,
          };
        });
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
    this.applyFiltersToTables();
  }

  editTransaction(item: TransactionExpand, tableIndex: number) {
    const dialog = this.dialog.open(TransactionUpdateDialog, {
      data: { formData: item, task: 'edit' },
    });

    dialog.afterClosed().subscribe((result: TransactionExpand | null) => {
      if (result) {
        this.updateTransactionDataSource(result);
        this.snackBar.open('Updated!', 'Success', {
          duration: 3000,
        });
      }
    });
  }

  deleteTransaction(item: TransactionExpand, tableIndex: number) {
    const dialog = this.dialog.open(TransactionDeleteDialog, {
      data: { formData: item, task: 'delete' },
    });
    dialog.afterClosed().subscribe((result) => {
      if (result) {
        this.updateTransactionDataSource(result);
        this.snackBar.open('Deleted!', 'Success', {
          duration: 3000,
        });
      }
    });
  }

  addTransaction() {
    const dialog = this.dialog.open(TransactionUpdateDialog, {
      data: { formData: null, task: 'add' },
    });
    dialog.afterClosed().subscribe((result) => {
      if (result) {
        this.updateTransactionDataSource(result);
        this.snackBar.open('Updated!', 'Success', {
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
    const dialog = this.dialog.open(TransactionUpdateDialog, {
      data: {
        formData: formData,
        task: 'merge',
        mergeIds: mergeIds,
      },
    });
    dialog.afterClosed().subscribe((result: TransactionExpand | null) => {
      if (result) {
        const year = result.year;
        const month = result.month;
        let parentIndex = this.allTransactions.findIndex(
          (x) => x.year === year && x.month === month,
        );
        if (parentIndex !== -1) {
          this.allTransactions[parentIndex].transactions = this.allTransactions[
            parentIndex
          ].transactions.filter((x) => !mergeIds.includes(x.id));
        }
        this.updateTransactionDataSource(result);
        this.selection.clear();
        this.snackBar.open('Updated!', 'Success', {
          duration: 3000,
        });
      }
    });
  }

  private updateTransactionDataSource(newTransaction: TransactionExpand) {
    const year = newTransaction.year;
    const month = newTransaction.month;
    let parentIndex = this.allTransactions.findIndex(
      (x) => x.year === year && x.month === month,
    );
    let childIndex = -1;
    if (parentIndex !== -1) {
      const transactions = this.allTransactions[parentIndex].transactions;
      childIndex = transactions.findIndex((x) => x.id === newTransaction.id);
      if (childIndex !== -1) {
        if (newTransaction.is_deleted) {
          this.allTransactions[parentIndex].transactions = this.allTransactions[
            parentIndex
          ].transactions.filter((x) => x.id !== newTransaction.id);
        } else {
          this.allTransactions[parentIndex].transactions[childIndex] =
            newTransaction;
        }
      } else {
        this.allTransactions[parentIndex].transactions.push(newTransaction);
      }
    } else {
      const transactionItem: MonthlyTransaction = {
        year: newTransaction.year,
        month: newTransaction.month,
        month_text: newTransaction.month_text,
        total: newTransaction.amount || 0,
        transactions: [newTransaction],
      };
      this.allTransactions.push(transactionItem);
      parentIndex = this.allTransactions.length - 1;
    }
    const dataSource = new MatTableDataSource<TransactionExpand>(
      this.allTransactions[parentIndex].transactions,
    );
    dataSource.filterPredicate = this.createFilterPredicate();
    dataSource.filter = JSON.stringify(this.filterParams()).trim();
    if (parentIndex < this.allDataSource.length) {
      this.allDataSource[parentIndex] = dataSource;
    } else {
      this.allDataSource.push(dataSource);
    }
    this.allTransactions[parentIndex].total = dataSource.filteredData.reduce(
      (total, item) => total + (item.amount === null ? 0 : item.amount),
      0,
    );
    this.totalAnnualAmount.set(0);
    this.allTransactions.forEach((table) => {
      this.totalAnnualAmount.update((x) => x + table.total);
    });
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
      data: { filterParams: this.filterParams() },
    });

    dialog.afterClosed().subscribe((result) => {
      if (result) {
        this.filterParams.update(() => {
          return {
            year: result.filters.year,
            target: result.filters.target,
            categories: result.filters.categories,
            subcategories: result.filters.subcategories,
            paymentMethods: result.filters.paymentMethods,
          };
        });
        this.applyFiltersToTables();
        this.loadingService.loadingOff();
      }
    });
  }

  private applyFiltersToTables() {
    const filters = this.filterParams();
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

  panelAction() {
    this.allExpanded = !this.allExpanded;
    if (this.allExpanded) {
      this.accordion().openAll();
    } else {
      this.accordion().closeAll();
    }
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

      return <boolean>(
        (data.year === filterObject.year &&
          (c1 ||
            (c2 && subCategoryIncludes) ||
            (c3 && categoryIncludes) ||
            (c4 && (categoryIncludes || subCategoryIncludes))))
      );
    };
  }

  onSortData(sort: Sort, tableIndex: number) {
    let data = this.allDataSource[tableIndex].data;
    if (sort.active && sort.direction !== '') {
      data = data.sort((a: TransactionExpand, b: TransactionExpand) => {
        const isAsc = sort.direction === 'asc';
        switch (sort.active) {
          case 'PaymentMethod':
            return this.compare(
              a.payment_method_text,
              b.payment_method_text,
              isAsc,
            );
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
    dataSource.filter = JSON.stringify(this.filterParams()).trim();
    this.allDataSource[tableIndex] = dataSource;
  }

  private compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  removeChip(chip: { name: string | undefined; id: number; type: string }) {
    this.filterParams.update((x) => {
      return {
        year: x.year,
        target: x.target,
        categories:
          chip.type === 'category'
            ? x.categories?.filter((y) => y !== chip.id)
            : x.categories,
        subcategories:
          chip.type === 'subcategory'
            ? x.subcategories?.filter((y) => y !== chip.id)
            : x.subcategories,
      };
    });
    this.applyFiltersToTables();
  }

  getEmptyFilterParams(): TransactionFilter {
    return {
      year: this.dataService.getFilterYear(),
      target: this.lastSegment() || '',
      categories: [],
      subcategories: [],
      paymentMethods: [],
    };
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  protected readonly faChartBar = faChartBar;
  protected readonly faChartColumn = faChartColumn;

  showAnalytics(tableIndex: number) {

  }
}
