import {Component, ElementRef, inject, OnInit, ViewChild} from '@angular/core';
import { LoadingService } from '../../shared/loading/loading.service';
import {
  faCirclePlus,
  faExpand,
  faFilter,
  faMinimize,
  faUpload,
} from '@fortawesome/free-solid-svg-icons';
import { TransactionUpdateDialog } from '../transaction-update/transaction-update.component';
import { MatDialog } from '@angular/material/dialog';
import { DataService } from '../service/data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import {TransactionFilterComponent} from "../transaction-filter/transaction-filter.component";


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

  loadingService = inject(LoadingService);
  dataService = inject(DataService);
  allExpanded = false;
  lastSegment = '';

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {}


  ngOnInit(): void {
    this.loadingService.loadingOn();
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
    this.dialog.closeAll()
    const rect = this.element.nativeElement.getBoundingClientRect();
    const dialog = this.dialog.open(TransactionFilterComponent, {
      width: '700px',
      height: '500px',
      position: { top: `${rect.bottom + 10}px`, right: `20px` },
      hasBackdrop: true,
    });

    dialog.afterClosed().subscribe((result) => {
      this.dataService.setFilters(result.refresh);
      this.dataService.setPanelActions(this.allExpanded)
    });
  }

  panelAction() {
    this.allExpanded = !this.allExpanded;
    this.dataService.setPanelActions(this.allExpanded)
  }
}
