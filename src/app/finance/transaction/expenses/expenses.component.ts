import {
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  faCirclePlus,
  faFilter,
  faPencil,
  faTrash,
  faUpload,
} from '@fortawesome/free-solid-svg-icons';
import { TransactionFilterComponent } from '../../transaction-filter/transaction-filter.component';
import { TransactionUpdateDialog } from '../../transaction-update/transaction-update.component';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionService } from '../../service/session.service';
import { MonthlyTransaction } from '../../model/transactions';
import { LoadingService } from '../../../shared/loading/loading.service';


@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrl: './expenses.component.css',
})
export class ExpensesComponent implements OnInit {
  @ViewChild('filterButton') element: ElementRef;

  sessionData = this.sessionService.getData();
  protected readonly faCirclePlus = faCirclePlus;
  protected readonly faPencil = faPencil;
  protected readonly faTrash = faTrash;
  protected readonly faFilter = faFilter;
  protected readonly faUpload = faUpload;

  dataYear: number[] = [];
  dataMonth: number[] = [];
  paymentMethod: number[] = [];
  transactionCategory: number[] = [];
  transactionSubCategory: number[] = [];
  searchQuery: string = '';
  today = new Date();
  currentMonthNumber = this.today.getMonth() + 1;
  currentYear = this.today.getFullYear();
  transactionData: MonthlyTransaction[] = [];
  hiddenFilterBadge = true;
  targetTables = 0;
  renderedTables = 0;
  loadingService = inject(LoadingService);

  constructor(
    private dialog: MatDialog,
    protected router: Router,
    protected route: ActivatedRoute,
    private sessionService: SessionService,
  ) {}

  ngOnInit(): void {
    this.initSearchParams(null);
    this.filterData();
  }

  initSearchParams(data: any) {
    if (data) {
      this.dataYear = data.years;
      this.dataMonth = data.months;
      this.paymentMethod = data.payment_methods;
      this.transactionCategory = data.categories;
      this.transactionSubCategory = data.subcategories;
      this.hiddenFilterBadge = false;
    } else {
      this.dataYear = [];
      this.dataMonth = [];
      this.paymentMethod = [];
      this.transactionCategory = [];
      this.transactionSubCategory = [];
      this.hiddenFilterBadge = true;
    }
    if (this.dataYear.length == 0) {
      this.dataYear = [this.currentYear];
    }
    if (this.dataMonth.length == 0) {
      this.dataMonth = Array.from(
        { length: this.currentMonthNumber },
        (_, i) => i + 1,
      );
    }
  }
  openFilters() {
    const rect = this.element.nativeElement.getBoundingClientRect();
    const dialog = this.dialog.open(TransactionFilterComponent, {
      width: '700px',
      height: '500px',
      position: { top: `${rect.bottom + 10}px`, right: `20px` },
      data: {
        categories: this.transactionCategory,
        subcategories: this.transactionSubCategory,
        years: this.dataYear,
        months: this.dataMonth,
        paymentMethods: this.paymentMethod,
      },
      hasBackdrop: false,
    });

    dialog.afterClosed().subscribe((result) => {
      this.initSearchParams(result.data);
      this.filterData();
    });
  }

  protected filterData() {
    let years: number[] = this.dataYear || [];
    let months: number[] = this.dataMonth || [];
    const paymentMethods: number[] = this.paymentMethod || [];
    const categories: number[] = this.transactionCategory || [];
    const subCategories: number[] = this.transactionSubCategory || [];
    const searchQuery: string = this.searchQuery;

    const currData = this.sessionData.expenses
      .filter((x) => years.includes(x.year))
      .filter((x) => (months.length > 0 ? months.includes(x.month) : true))
      .sort((x, y) => y.month - x.month)
      .sort((x, y) => y.year - x.year);
    currData.forEach((x) => {
      x.transactions_cp = x.transactions
        .filter((y) =>
          paymentMethods && paymentMethods.length > 0
            ? paymentMethods.includes(y.payment_method)
            : true,
        )
        .filter((y) =>
          categories.length > 0 ? categories.includes(y.category) : true,
        )
        .filter((y) =>
          subCategories.length > 0
            ? subCategories.includes(y.subcategory)
            : true,
        )
        .filter((y) =>
          searchQuery.length > 0
            ? y.destination.includes(searchQuery) ||
              y.alias?.includes(searchQuery)
            : true,
        );
      x.total = x.transactions_cp.reduce(
        (total, { amount }) => total + amount!,
        0,
      );
    });
    this.targetTables = currData.length;
    this.transactionData = JSON.parse(JSON.stringify(currData));
    this.loadingService.loadingOff();
  }

  addTransaction() {
    this.dialog.open(TransactionUpdateDialog, {
      width: '850px',
      position: {
        top: '50px',
      },
      data: { formData: null, task: 'add' },
    });
  }

  tableRendered() {
    //this.loadingService.loadingOff();
  }


}
