import {Component, Inject, OnInit} from '@angular/core';
import {
  faCalendar,
  faCreditCard,
  faLayerGroup,
  faShop,
} from '@fortawesome/free-solid-svg-icons';
import {
  INCOME_CATEGORIES,
  MONTHS,
  NA_CATEGORY_ID,
  NA_SUB_CATEGORY_ID, PAYMENT_CATEGORY_ID,
  PAYMENT_METHODS, SAVINGS_CATEGORY_ID,
  TRANSACTION_CATEGORIES,
  TRANSACTION_SUB_CATEGORIES,
  YEARS,
} from '../../data/client.data';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DropDownType } from '../../data/shared.data';
import { SessionService } from '../service/session.service';
import {TransactionFilterChip} from "../model/transactions";

interface FilterDialogData {
  filterTarget: string
}

@Component({
  selector: 'app-transaction-filter',
  templateUrl: './transaction-filter.component.html',
  styleUrl: './transaction-filter.component.css',
})
export class TransactionFilterComponent implements OnInit {
  protected readonly faLayerGroup = faLayerGroup;
  protected readonly faShop = faShop;
  protected readonly faCreditCard = faCreditCard;
  protected readonly faCalendar = faCalendar;

  clickedType: string = 'categories';
  categoryTitle = 'Categories';
  subCategoryTitle =
    TRANSACTION_SUB_CATEGORIES[NA_SUB_CATEGORY_ID][0].viewValue;
  selectedCategory: number = NA_SUB_CATEGORY_ID;
  transactionCategories: DropDownType[] = TRANSACTION_CATEGORIES;
  transactionSubCategories: DropDownType[] =
    TRANSACTION_SUB_CATEGORIES[NA_SUB_CATEGORY_ID];
  years = YEARS;
  months = MONTHS;
  paymentMethods = PAYMENT_METHODS;
  mainCategoryForm: FormGroup;
  subCategoryForm: FormGroup;
  paymentMethodForm: FormGroup;
  yearForm: FormGroup;
  monthsForm: FormGroup;
  sessionData = this.sessionService.getData();

  constructor(
    private formBuilder: FormBuilder,
    private sessionService: SessionService,
    public dialogRef: MatDialogRef<TransactionFilterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FilterDialogData,
  ) {}

  ngOnInit() {
    //this.modifyFilterOptions()
    this.createForm();
  }

  modifyFilterOptions() {
    if(this.data.filterTarget === 'payments') {
      this.transactionCategories = TRANSACTION_CATEGORIES.filter(x => x.value === PAYMENT_CATEGORY_ID);
      this.transactionSubCategories = TRANSACTION_SUB_CATEGORIES[PAYMENT_CATEGORY_ID];
    } else if (this.data.filterTarget === 'savings') {
      this.transactionCategories = TRANSACTION_CATEGORIES.filter(x => x.value === SAVINGS_CATEGORY_ID);
      this.transactionSubCategories = TRANSACTION_SUB_CATEGORIES[SAVINGS_CATEGORY_ID];
    } else if (this.data.filterTarget === 'income') {
      this.transactionCategories = INCOME_CATEGORIES;
      this.transactionSubCategories = [];
    }
    this.subCategoryTitle = this.transactionSubCategories.length > 0 ? this.transactionSubCategories[0].viewValue : '';
  }

  createForm() {
    const categoryGroup: any = {};
    const subCategoryGroup: any = {};
    const paymentMethodGroup: any = {};
    const yearGroup: any = {};
    const monthsGroup: any = {};
    const filters = this.sessionData.filters.find(x => x.target === this.data.filterTarget);
    const conditions = filters!.conditions;

    TRANSACTION_CATEGORIES.forEach((category: DropDownType) => {
      categoryGroup[`category_${category.value}`] = new FormControl(conditions.categories.includes(category.value));
      const subCategories = TRANSACTION_SUB_CATEGORIES[category.value];
      subCategories.forEach((subcategory: DropDownType) => {
        subCategoryGroup[
          `subcategory_${subcategory.value}`
        ] = new FormControl(conditions.subcategories.includes(subcategory.value));
      });
    });

    PAYMENT_METHODS.forEach((category: DropDownType) => {
      paymentMethodGroup[`paymentmethod_${category.value}`] = new FormControl(conditions.paymentMethods.includes(category.value));
    });
    YEARS.forEach((category: DropDownType) => {
      yearGroup[`year_${category.value}`] = new FormControl(conditions.years.includes(category.value));
    });
    MONTHS.forEach((category: DropDownType) => {
      monthsGroup[`month_${category.value}`] = new FormControl(conditions.months.includes(category.value));
    });
    this.mainCategoryForm = this.formBuilder.group(categoryGroup);
    this.subCategoryForm = this.formBuilder.group(subCategoryGroup);
    this.paymentMethodForm = this.formBuilder.group(paymentMethodGroup);
    this.yearForm = this.formBuilder.group(yearGroup);
    this.monthsForm = this.formBuilder.group(monthsGroup);
  }

  clickOnOption(filterType: string, filterOption: DropDownType) {
    this.selectedCategory = filterOption.value;
    this.subCategoryTitle = filterOption.viewValue;
    if (filterType == 'categories') {
      this.transactionSubCategories =
        TRANSACTION_SUB_CATEGORIES[filterOption.value];
    }
  }

  clickOnMainFilter(filterType: string) {
    this.clickedType = filterType;
    if (filterType == 'categories') {
      this.categoryTitle = 'Categories';
      this.subCategoryTitle =
        TRANSACTION_SUB_CATEGORIES[NA_SUB_CATEGORY_ID][0].viewValue;
      this.selectedCategory = NA_CATEGORY_ID
      this.transactionSubCategories = TRANSACTION_SUB_CATEGORIES[NA_SUB_CATEGORY_ID]
    } else if (filterType == 'payment_method') {
      this.categoryTitle = 'Payment Method';
      this.subCategoryTitle = '';
    } else if (filterType == 'payee') {
      this.categoryTitle = 'Payee';
      this.subCategoryTitle = '';
    } else if (filterType == 'year') {
      this.categoryTitle = 'Year';
      this.subCategoryTitle = 'Month';
    }
  }

  private extractParams(dataSource: any) {
    const  results: number[] = []
    Object.keys(dataSource).forEach((x) => {
      const isChecked = dataSource[x];
      if (isChecked) {
        const value = x.split('_')
        results.push(Number(value[1]))
      }
    })
    return results;
  }

  clear() {
    this.sessionService.clearSessionFilter(this.data.filterTarget)
    this.dialogRef.close({refresh: true, filters: false})
  }
  submit() {
    const filterParams: any = {'categories': [], 'subcategories': [], 'paymentMethods': [], 'years': [], 'months': []};
    filterParams['categories'] = this.extractParams(this.mainCategoryForm.value);
    filterParams['subcategories'] = this.extractParams(this.subCategoryForm.value);
    filterParams['paymentMethods'] = this.extractParams(this.paymentMethodForm.value);
    filterParams['years'] = this.extractParams(this.yearForm.value);
    filterParams['months'] = this.extractParams(this.monthsForm.value);

    const filterChips: TransactionFilterChip[] = [];
    filterParams['categories'].forEach((x: Number) => {
      const cat = TRANSACTION_CATEGORIES.find(y => y.value === x)
      if (cat) {
        filterChips.push({'id': x.valueOf(), 'value': cat.viewValue})
      }
    })

    const idx = this.sessionData.filters.findIndex(x => x.target === this.data.filterTarget);
    if (idx !== -1) {
      this.sessionData.filters[idx] = {target: this.data.filterTarget, conditions: filterParams, filterChips: filterChips}
    } else {
      this.sessionData.filters.push({target: this.data.filterTarget, conditions: filterParams, filterChips: []})
    }
    this.dialogRef.close({refresh: true, filters: true});
  }
}
