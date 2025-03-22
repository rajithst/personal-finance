import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSelect, MatSelectTrigger } from '@angular/material/select';
import { MatOption, provideNativeDateAdapter } from '@angular/material/core';
import { ApiService } from '../../../core/api.service';
import {
  Widget,
  WidgetComponent,
} from '../../../components/widget/widget.component';
import {
  AnalyticsCategoryWidget,
  AnalyticsChartWidget,
  TotalSummaryWidget,
} from '../widgets/chart-widgets';
import { AnalyticsService } from '../analytics.service';
import { FinanceStore } from '../../../core/store/finance.store';
import {
  DEFAULT_ANALYTICS_DATE_RANGE,
  TRANSACTION_TYPE_EXPENSE_ID,
  TRANSACTION_TYPE_INCOME_ID,
  TRANSACTION_TYPE_PAYMENTS_ID,
  TRANSACTION_TYPE_SAVINGS_ID,
  TRANSACTION_TYPES,
} from '../../data/client.data';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  MatDatepicker,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import moment from 'moment';
import { TransactionCategory } from '../../model/common';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.scss',
  imports: [
    MatCard,
    MatCardContent,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    MatSelectTrigger,
    WidgetComponent,
    ReactiveFormsModule,
    MatDatepickerModule,
  ],
  providers: [AnalyticsService, provideNativeDateAdapter()],
})
export class AnalyticsComponent implements OnInit {
  private readonly apiService = inject(ApiService);
  private readonly analyticsService = inject(AnalyticsService);
  private readonly store = inject(FinanceStore);
  @ViewChild('picker') rangePicker: MatDatepicker<any>;

  EXPENSE_CATEGORIES: TransactionCategory[] = this.store.expenseCategories();
  INCOME_CATEGORIES: TransactionCategory[] = this.store.incomeCategories();
  SAVINGS_CATEGORIES: TransactionCategory[] = this.store.savingsCategories();
  PAYMENT_CATEGORIES: TransactionCategory[] = this.store.paymentCategories();
  dateRanges = DEFAULT_ANALYTICS_DATE_RANGE;

  categories = this.EXPENSE_CATEGORIES;
  transactionTypes = TRANSACTION_TYPES;
  widgets: Widget[] = [];

  readonly categoryFormControl = new FormControl<number | null>(null);
  readonly dateRangeFormControl = new FormControl<number | null>(null);
  readonly transactionTypeControl = new FormControl<number | null>(
    TRANSACTION_TYPE_EXPENSE_ID,
  );
  readonly startDateControl = new FormControl<Date | null>(null);
  readonly endDateControl = new FormControl<Date | null>(null);

  filterFormGroup = new FormGroup({
    transactionType: this.transactionTypeControl,
    category: this.categoryFormControl,
    dateRange: this.dateRangeFormControl,
  });
  range = new FormGroup({
    start: this.startDateControl,
    end: this.endDateControl,
  });
  dateRangeDisplayValue = signal('');
  selectionDisplayValue = signal('');
  startDate = signal('');
  endDate = signal('');
  noData = signal(false);

  ngOnInit(): void {
    this.getData().then();

    this.transactionTypeControl.valueChanges.subscribe(
      (value: number | null) => {
        if (value !== null) {
          this.modifyFilterOptions(value);
          this.categoryFormControl.setValue(0);
          this.getData();
        }
      },
    );
    this.categoryFormControl.valueChanges.subscribe((value: number | null) => {
      this.getData();
    });

    this.dateRangeFormControl.valueChanges.subscribe((value: number | null) => {
      if (value === 7) {
        this.dateRangeDisplayValue.set('Custom Range');
      } else {
        this.selectionDisplayValue.set(
          DEFAULT_ANALYTICS_DATE_RANGE.find(
            (x) => x.value === this.dateRangeFormControl.value,
          )?.viewValue ?? '',
        );
        switch (value) {
          case 1:
            this.startDate.set(moment().startOf('month').format('YYYY-MM-DD'));
            this.endDate.set(moment().endOf('month').format('YYYY-MM-DD'));
            break;
          case 2:
            this.startDate.set(moment().format('YYYY-MM-DD'));
            this.endDate.set(
              moment().subtract(1, 'months').format('YYYY-MM-DD'),
            );
            break;
          case 3:
            this.startDate.set(moment().format('YYYY-MM-DD'));
            this.endDate.set(
              moment().subtract(3, 'months').format('YYYY-MM-DD'),
            );
            break;
          case 4:
            this.startDate.set(moment().format('YYYY-MM-DD'));
            this.endDate.set(
              moment().subtract(6, 'months').format('YYYY-MM-DD'),
            );
            break;
          case 5:
            this.startDate.set(moment().format('YYYY-MM-DD'));
            this.endDate.set(moment().startOf('year').format('YYYY-MM-DD'));
            break;
          case 6:
            this.startDate.set(
              moment().subtract(1, 'year').endOf('year').format('YYYY-MM-DD'),
            );
            this.endDate.set(
              moment().subtract(1, 'year').startOf('year').format('YYYY-MM-DD'),
            );
            break;
          default:
            this.startDate.set('');
            this.endDate.set('');
        }
        this.getData();
      }
    });
  }

  async getData() {
    const getColor = () =>
      `#${[...Array(6)].map(() => '0123456789ABCDEF'[Math.floor(Math.random() * 16)]).join('')}`;

    const payload = {
      target: this.transactionTypeControl.value,
      start_date: this.startDate(),
      end_date: this.endDate(),
      category:
        this.categoryFormControl.value === 0
          ? null
          : this.categoryFormControl.value,
    };
    let data = await this.apiService.getAnalytics(payload);
    this.noData.set(data.length === 0);
    if (data) {
      const isCategorySelect =
        this.categoryFormControl.value !== 0 &&
        this.categoryFormControl.value !== null;
      if (isCategorySelect) {
        data[0].subcategories = data[0].subcategories.map((x) => ({
          ...x,
          color: getColor(),
        }));
      }
      const dataWithColorCode = data.map((x) => ({ ...x, color: getColor() }));
      const dateRange = this.startDate()
        ? `${this.startDate()} - ${this.endDate()}`
        : 'All Time';
      this.analyticsService.setAnalyticsData(dataWithColorCode);
      this.analyticsService.setSubcategoryVisibility(isCategorySelect);
      this.analyticsService.setDateRange(dateRange);
      this.prepareWidgets();
    }
  }

  modifyFilterOptions(transactionType: number) {
    if (transactionType === TRANSACTION_TYPE_PAYMENTS_ID) {
      this.categories = [
        ...this.PAYMENT_CATEGORIES,
        ...this.EXPENSE_CATEGORIES,
      ];
    } else if (transactionType === TRANSACTION_TYPE_SAVINGS_ID) {
      this.categories = this.SAVINGS_CATEGORIES;
    } else if (transactionType === TRANSACTION_TYPE_INCOME_ID) {
      this.categories = this.INCOME_CATEGORIES;
    } else {
      this.categories = this.EXPENSE_CATEGORIES;
    }
  }

  prepareWidgets() {
    const pickedType =
      this.transactionTypes.find(
        (x) => x.value === this.transactionTypeControl.value,
      )?.viewValue ?? '';
    const pickedCategory =
      this.categories.find((x) => x.id === this.categoryFormControl.value)
        ?.category ?? null;
    this.widgets = [
      {
        id: 1,
        label: `${pickedCategory ?? pickedType} Summary`,
        content: TotalSummaryWidget,
        rows: 3,
        columns: 1,
        hideSettingsButton: true,
      },
      {
        id: 1,
        label: pickedCategory ?? pickedType,
        content: AnalyticsChartWidget,
        rows: 3,
        columns: 1,
        hideSettingsButton: true,
      },
      {
        id: 1,
        label: `${pickedCategory ?? pickedType} Breakdown`,
        content: AnalyticsCategoryWidget,
        rows: 3,
        columns: 2,
        hideSettingsButton: true,
      },
    ];
  }

  onRangeChange() {
    const startDate = `${moment(this.startDateControl.value ?? '')
      .format('YYYY-MM-DD')
      .toString()}`;
    const endDate = `${moment(this.endDateControl.value ?? '')
      .format('YYYY-MM-DD')
      .toString()}`;
    this.startDate.set(startDate);
    this.endDate.set(endDate);
    this.dateRangeDisplayValue.set(`${startDate} - ${endDate}`);
    this.getData();
  }
}
