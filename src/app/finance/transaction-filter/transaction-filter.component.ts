import { Component, OnInit } from '@angular/core';
import {
  faCalendar,
  faCreditCard,
  faLayerGroup,
  faShop,
} from '@fortawesome/free-solid-svg-icons';
import {
  MONTHS,
  NA_CATEGORY_ID,
  NA_SUB_CATEGORY_ID,
  PAYMENT_METHODS,
  TRANSACTION_CATEGORIES,
  TRANSACTION_SUB_CATEGORIES,
  YEARS,
} from '../../data/client.data';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DropDownType } from '../../data/shared.data';
import { SessionService } from '../service/session.service';

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
  ) {}

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    const categoryGroup: any = {};
    const subCategoryGroup: any = {};
    const paymentMethodGroup: any = {};
    const yearGroup: any = {};
    const monthsGroup: any = {};
    const filters = this.sessionData.filters;
    TRANSACTION_CATEGORIES.forEach((category: DropDownType) => {
      categoryGroup[`category_${category.value}`] = new FormControl(filters.categories.includes(category.value));
      const subCategories = TRANSACTION_SUB_CATEGORIES[category.value];
      subCategories.forEach((subcategory: DropDownType) => {
        subCategoryGroup[
          `subcategory_${subcategory.value}`
        ] = new FormControl(filters.subcategories.includes(category.value));
      });
    });

    PAYMENT_METHODS.forEach((category: DropDownType) => {
      paymentMethodGroup[`paymentmethod_${category.value}`] = new FormControl(filters.paymentMethods.includes(category.value));
    });
    YEARS.forEach((category: DropDownType) => {
      yearGroup[`year_${category.value}`] = new FormControl(filters.years.includes(category.value));
    });
    MONTHS.forEach((category: DropDownType) => {
      monthsGroup[`month_${category.value}`] = new FormControl(filters.months.includes(category.value));
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
    this.sessionData.filters = {
      categories: [],
      subcategories: [],
      paymentMethods: [],
      years: [2024],
      months: [],
    };
    this.dialogRef.close({refresh: true})
  }
  submit() {
    const filterParams: any = {'categories': [], 'subcategories': [], 'paymentMethods': [], 'years': [], 'months': []};
    filterParams['categories'] = this.extractParams(this.mainCategoryForm.value);
    filterParams['subcategories'] = this.extractParams(this.subCategoryForm.value);
    filterParams['paymentMethods'] = this.extractParams(this.paymentMethodForm.value);
    filterParams['years'] = this.extractParams(this.yearForm.value);
    filterParams['months'] = this.extractParams(this.monthsForm.value);
    this.sessionData.filters = filterParams;
    this.dialogRef.close({refresh: true});
  }
}
