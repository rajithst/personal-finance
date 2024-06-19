import {
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { LoadingService } from '../../shared/loading/loading.service';
import {
  faCirclePlus, faCodeMerge,
  faExpand,
  faFilter,
  faMinimize, faPencil, faTrash,
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
import { TransactionFilterChip } from '../model/transactions';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrl: './transaction.component.css',
})
export class FinanceComponent implements OnInit {
  @ViewChild('filterButton') element: ElementRef;

  protected readonly faUpload = faUpload;
  protected readonly faMinimize = faMinimize;
  protected readonly faCirclePlus = faCirclePlus;
  protected readonly faFilter = faFilter;
  protected readonly faExpand = faExpand;
  protected readonly faPencil = faPencil;
  protected readonly faTrash = faTrash;
  protected readonly faCodeMerge = faCodeMerge;

  private loadingService = inject(LoadingService);
  private dataService = inject(DataService);
  private sessionService = inject(SessionService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private route = inject(Router);

  allExpanded = false;
  filterEnabled = false;
  lastSegment = '';
  categoryChipset: TransactionFilterChip[] | null = [];
  pageTitle = 'Transaction'

  sessionData = this.sessionService.getData();

  constructor() {
    this.route.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe((val: any) => {
        const urlAfterRedirect = val.urlAfterRedirects;
        const segments = urlAfterRedirect.split('/');
        this.lastSegment = segments[segments.length - 1];
        this.preparePageTitle()
        this.prepareChips();
      });
  }

  ngOnInit(): void {
    this.loadingService.loadingOn();
    this.prepareChips();
  }

  preparePageTitle() {
    if (this.lastSegment === 'income') {
      this.pageTitle = 'Income';
    } else if (this.lastSegment === 'savings') {
      this.pageTitle = 'Savings';
    } else if (this.lastSegment === 'payments') {
      this.pageTitle = 'Payments'
    }
  }
  prepareChips() {
    const filters = this.sessionData.filters.find(
      (x) => x.target === this.lastSegment,
    );
    if (filters) {
      this.categoryChipset = filters.filterChips;
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
    const rect = this.element.nativeElement.getBoundingClientRect();
    const dialog = this.dialog.open(TransactionFilterComponent, {
      width: '700px',
      height: '500px',
      position: { top: `${rect.bottom + 10}px`, right: `20px` },
      hasBackdrop: true,
      data: { filterTarget: this.lastSegment },
    });

    dialog.afterClosed().subscribe((result) => {
      this.dataService.setFilters(result.refresh);
      this.dataService.setPanelActions(this.allExpanded);
      this.filterEnabled = result.filters;
      this.prepareChips();
    });
  }

  panelAction() {
    this.allExpanded = !this.allExpanded;
    this.dataService.setPanelActions(this.allExpanded);
  }

  removeFilterChip(filterId: number) {
    const idx = this.sessionData.filters.findIndex(
      (x) => x.target === this.lastSegment,
    );
    if (idx !== -1) {
      const chipId = this.sessionData.filters[idx].filterChips?.findIndex(
        (x) => x.id === filterId,
      );
      if (chipId !== -1) {
        this.sessionData.filters[idx].filterChips?.splice(chipId!, 1);
      }
      this.sessionData.filters[idx].conditions.categories =
        this.sessionData.filters[idx].conditions.categories.filter(
          (x) => x !== filterId,
        );
      this.filterEnabled = false;
      this.dataService.setFilters(true);
    }
  }

  applyFilter($event: KeyboardEvent) {

  }
}
