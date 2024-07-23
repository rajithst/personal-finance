import {
  Component,
  ElementRef,
  inject,
  Input,
  OnChanges,
  viewChild,
} from '@angular/core';
import {
  MonthlyTransaction,
  TransactionExpand,
  TransactionFilter,
} from '../model/transactions';
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
  faFilter,
  faList,
  faMinimize,
  faPencil,
  faScissors,
  faTrash,
  faUpload,
} from '@fortawesome/free-solid-svg-icons';
import { MatTableDataSource } from '@angular/material/table';
import { DataService } from '../service/data.service';
import { SelectionModel } from '@angular/cdk/collections';
import { MatAccordion } from '@angular/material/expansion';
import { TransactionFilterComponent } from '../transaction-filter/transaction-filter.component';
import { LoadingService } from '../../shared/loading/loading.service';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-transaction-table',
  templateUrl: './transaction-table.component.html',
  styleUrl: './transaction-table.component.css',
})
export class TransactionTableComponent implements OnChanges {
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

  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private loadingService = inject(LoadingService);
  private dataService = inject(DataService);

  dataSource: MatTableDataSource<TransactionExpand>;
  selection = new SelectionModel<TransactionExpand>(true, []);
  allDataSource: MatTableDataSource<TransactionExpand>[] = [];
  allTransactions: MonthlyTransaction[] = [];
  bulkSelectedTableIndex: number = -1;
  allExpanded = false;
  filterParams: TransactionFilter;
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

  ngOnChanges() {
    this.allTransactions =
      this.transactions.length > 0 ? this.transactions : [];
    this.allTransactions.forEach((x: MonthlyTransaction, index: number) => {
      this.allDataSource.splice(
        index,
        0,
        new MatTableDataSource<TransactionExpand>(x.transactions),
      );
      this.allDataSource[index].filterPredicate = this.createFilterPredicate();
    });
    this.filterParams = this.dataService.getEmptyFilterParams();
  }

  editRecord(item: TransactionExpand, tableIndex: number) {
    const dialog = this.dialog.open(TransactionUpdateDialog, {
      width: '850px',
      position: {
        top: '10%',
      },
      data: { formData: item, task: 'edit' },
    });

    dialog.afterClosed().subscribe((result: TransactionExpand | null) => {
      if (result) {
        const orAmount = item.amount;
        const newAmount = result.amount;
        const tableData = this.allDataSource[tableIndex].data;
        const transactionId = tableData.findIndex(
          (x: TransactionExpand) => x.id == result.id,
        );
        tableData[transactionId] = result;
        const dataSource = new MatTableDataSource<TransactionExpand>(tableData);
        dataSource.filterPredicate = this.createFilterPredicate();
        dataSource.filter = JSON.stringify(this.filterParams).trim();
        this.allDataSource[tableIndex] = dataSource;
        this.allTransactions[tableIndex].total += newAmount! - orAmount!;
        this.snackBar.open('Updated!', 'Success', {
          duration: 3000,
        });
      }
    });
  }

  deleteRecord(item: TransactionExpand, tableIndex: number) {
    const dialog = this.dialog.open(TransactionDeleteDialog, {
      width: '850px',
      position: {
        top: '10%',
      },
      data: { formData: item, task: 'delete' },
    });
    dialog.afterClosed().subscribe((result) => {
      if (result) {
        const newAmount = result.amount;
        const tableData = this.allDataSource[tableIndex].data.filter(
          (x) => x.id !== result.id,
        );
        const dataSource = new MatTableDataSource<TransactionExpand>(tableData);
        dataSource.filterPredicate = this.createFilterPredicate();
        dataSource.filter = JSON.stringify(this.filterParams).trim();
        this.allDataSource[tableIndex] = dataSource;
        this.allTransactions[tableIndex].total -= newAmount;
      }
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

  mergeTransactions() {
    const formData = JSON.parse(JSON.stringify(this.selection.selected[0]));
    if (!formData) return;
    formData.amount = this.selection.selected.reduce(
      (total, item) => total + (item.amount === null ? 0 : item.amount),
      0,
    );
    const mergeIds = this.selection.selected
      .filter((x) => x.id !== formData.id)
      .map((x) => x.id);
    const dialog = this.dialog.open(TransactionUpdateDialog, {
      width: '850px',
      position: {
        top: '10%',
      },
      data: {
        formData: formData,
        task: 'merge',
        mergeIds: mergeIds,
      },
    });
    dialog.afterClosed().subscribe((result: TransactionExpand | null) => {
      if (result) {
        const orAmount = formData.amount;
        const newAmount = result.amount;
        const tableData = this.allDataSource[this.bulkSelectedTableIndex].data;
        const transactionId = tableData.findIndex(
          (x: TransactionExpand) => x.id == result.id,
        );
        tableData[transactionId] = result;
        mergeIds.forEach((mergeId) => {
          const idx = tableData.findIndex((x) => x.id === mergeId);
          tableData.splice(idx, 1);
        });

        this.allTransactions[this.bulkSelectedTableIndex].total +=
          newAmount! - orAmount!;
        this.allDataSource.splice(
          this.bulkSelectedTableIndex,
          0,
          new MatTableDataSource<TransactionExpand>(tableData),
        );
        this.selection.clear();
        this.snackBar.open('Updated!', 'Success', {
          duration: 3000,
        });
      }
    });
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
        this.filterParams = result.filters;
        const filterValue = JSON.stringify(result.filters);
        this.allDataSource.forEach((y) => {
          y.filter = filterValue.trim();
        });
        let tableIndex = 0;
        this.allTransactions.forEach((x: MonthlyTransaction) => {
          x.total = this.allDataSource[tableIndex].filteredData.reduce(
            (a, b) => a + b.amount!,
            0,
          );
          tableIndex += 1;
        });
        this.loadingService.loadingOff();
      }
    });
  }

  createFilterPredicate(): (
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

  panelAction() {
    this.allExpanded = !this.allExpanded;
    if (this.allExpanded) {
      this.accordion().openAll();
    } else {
      this.accordion().closeAll();
    }
  }

  addTransaction() {
    const dialog = this.dialog.open(TransactionUpdateDialog, {
      width: '850px',
      position: {
        top: '50px',
      },
      data: { formData: null, task: 'add' },
    });
    dialog.afterClosed().subscribe((result) => {
      if (result) {
        this.snackBar.open('Updated!', 'Success', {
          duration: 3000,
        });
      }
    });
  }

  onSortData(sort: Sort, tableIndex: number) {
    let data = this.allDataSource[tableIndex].data;
    if (sort.active && sort.direction !== '') {
      data = data.sort((a: TransactionExpand, b: TransactionExpand) => {
        const isAsc = sort.direction === 'asc';
        switch (sort.active) {
          case 'PaymentMethod':
            return this.compare(a.payment_method_text, b.payment_method_text, isAsc);
          case 'Date':
            return this.compare(a.date, b.date, isAsc);
          case 'Destination':
            return this.compare(a.destination, b.destination, isAsc);
          case 'Category':
            return this.compare(+a.category_text, +b.category_text, isAsc);
          case 'SubCategory':
            return this.compare(+a.subcategory_text, +b.subcategory_text, isAsc);
          case 'Amount':
            return this.compare(+a.amount!, +b.amount!, isAsc);
          default:
            return 0;
        }
      });
    }

    const dataSource = new MatTableDataSource<TransactionExpand>(
        data,
      );
    dataSource.filterPredicate = this.createFilterPredicate();
    dataSource.filter = JSON.stringify(this.filterParams).trim();
    this.allDataSource[tableIndex] = dataSource;
  }

  private compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
}
