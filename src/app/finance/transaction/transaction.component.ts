import {
  Component,
  ElementRef,
  inject,
  OnInit,
  viewChild,
} from '@angular/core';
import { LoadingService } from '../../shared/loading/loading.service';
import {
  faCirclePlus,
  faCodeMerge,
  faExpand,
  faFilter,
  faMinimize,
  faPencil,
  faSquareCaretLeft,
  faSquareCaretRight,
  faTrash,
  faUpload,
} from '@fortawesome/free-solid-svg-icons';
import { TransactionUpdateDialog } from '../transaction-update/transaction-update.component';
import { MatDialog } from '@angular/material/dialog';
import { DataService } from '../service/data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TransactionFilterComponent } from '../transaction-filter/transaction-filter.component';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { SessionService } from '../service/session.service';
import { TransactionExpand } from '../model/transactions';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrl: './transaction.component.css',
})
export class FinanceComponent implements OnInit {
  protected readonly faUpload = faUpload;
  protected readonly faMinimize = faMinimize;
  protected readonly faCirclePlus = faCirclePlus;
  protected readonly faFilter = faFilter;
  protected readonly faExpand = faExpand;
  protected readonly faPencil = faPencil;
  protected readonly faTrash = faTrash;
  protected readonly faCodeMerge = faCodeMerge;
  protected readonly faSquareCaretRight = faSquareCaretRight;
  protected readonly faSquareCaretLeft = faSquareCaretLeft;

  private loadingService = inject(LoadingService);
  private dataService = inject(DataService);
  private sessionService = inject(SessionService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private route = inject(Router);

  filterButton = viewChild<ElementRef>('filterButton');
  searchInput = viewChild<ElementRef>('searchInput');

  allExpanded = false;
  filterEnabled = false;
  lastSegment = '';
  pageTitle = 'Transaction';
  today = new Date();
  currentYear = this.today.getFullYear();
  selectedTransactions: TransactionExpand[] = [];

  sessionData = this.sessionService.getData();

  constructor() {
    this.route.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe((val: any) => {
        const urlAfterRedirect = val.urlAfterRedirects;
        const segments = urlAfterRedirect.split('/');
        this.lastSegment = segments[segments.length - 1];
        this.preparePageTitle();
      });
  }

  ngOnInit(): void {
    this.loadingService.loadingOn();
    this.dataService.setBulkSelectTransactions([]);
    this.dataService.bulkSelectTransaction$.subscribe((value) => {
      this.selectedTransactions = value;
    });
  }

  preparePageTitle() {
    if (this.lastSegment === 'income') {
      this.pageTitle = 'Income';
    } else if (this.lastSegment === 'savings') {
      this.pageTitle = 'Savings';
    } else if (this.lastSegment === 'payments') {
      this.pageTitle = 'Payments';
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
        this.dataService.setTransaction(result);
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
      data: { filterTarget: this.lastSegment },
    });

    dialog.afterClosed().subscribe((result) => {
      if (result) {
        this.dataService.setFilters(result.refresh);
        this.dataService.setPanelActions(this.allExpanded);
        this.filterEnabled = result.filters;
      }
    });
  }

  panelAction() {
    this.allExpanded = !this.allExpanded;
    this.dataService.setPanelActions(this.allExpanded);
  }

  applyFilter() {
    const filterValue = this.searchInput()?.nativeElement.value;
    this.sessionService.setSearchQuery(filterValue);
    this.dataService.setSearchQuery(filterValue.toLowerCase());
  }

  changeFilterYear(direction: string) {
    if (direction === 'prev') {
      this.currentYear = this.currentYear - 1;
    } else {
      this.currentYear = this.currentYear + 1;
    }
    this.sessionService.setSessionFilterYear(this.currentYear);
    this.dataService.setFilterYear(this.currentYear);
  }

  mergeTransactions() {
    const dialog = this.dialog.open(TransactionUpdateDialog, {
      width: '850px',
      position: {
        top: '10%',
      },
      data: {
        formData: null,
        task: 'merge',
        formDataList: this.selectedTransactions,
      },
    });
    dialog.afterClosed().subscribe((result) => {
      if (result.refresh) {
        this.dataService.setTransaction(result);
        this.dataService.setBulkSelectTransactions([]);
        this.snackBar.open('Updated!', 'Success', {
          duration: 3000,
        });
      }
    });
  }
}
