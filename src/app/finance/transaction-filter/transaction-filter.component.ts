import { Component, Inject, OnInit } from '@angular/core';
import {
  faCalendar,
  faCreditCard,
  faLayerGroup,
  faShop,
} from '@fortawesome/free-solid-svg-icons';
import {
  DropDownType,
  MONTHS, NA_CATEGORY_ID,
  NA_SUB_CATEGORY_ID,
  PAYMENT_METHODS,
  TRANSACTION_CATEGORIES,
  TRANSACTION_SUB_CATEGORIES,
  YEARS,
} from '../../data/client.data';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

export interface TransactionFilterDialogData {}

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

  protected URL: string = '';
  clickedType: string = 'categories';
  categoryTitle = 'Categories';
  subCategoryTitle =
    TRANSACTION_SUB_CATEGORIES[NA_SUB_CATEGORY_ID][0].viewValue;
  selectedCategory: number = NA_SUB_CATEGORY_ID;
  mainCategoryForm: FormGroup;
  subCategoryForm: FormGroup;
  paymentMethodForm: FormGroup;
  yearForm: FormGroup;
  monthsForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<TransactionFilterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TransactionFilterDialogData,
  ) {}


  transactionCategories: DropDownType[] = TRANSACTION_CATEGORIES;
  transactionSubCategories: DropDownType[] =
    TRANSACTION_SUB_CATEGORIES[NA_SUB_CATEGORY_ID];
  years = YEARS;
  months = MONTHS;
  paymentMethods = PAYMENT_METHODS;

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    const categoryGroup: any = {};
    const subCategoryGroup: any = {};
    const paymentMethodGroup: any = {};
    const yearGroup: any = {};
    const monthsGroup: any = {};
    TRANSACTION_CATEGORIES.forEach((category: DropDownType) => {
      categoryGroup[`category_${category.value}`] = new FormControl(
        category.checked,
      );
      const subCategories = TRANSACTION_SUB_CATEGORIES[category.value];
      subCategories.forEach((subcategory: DropDownType) => {
        subCategoryGroup[
          `subcategory_${subcategory.value}`
        ] = new FormControl(subcategory.checked);
      });
    });

    PAYMENT_METHODS.forEach((category: DropDownType) => {
      paymentMethodGroup[`paymentmethod_${category.value}`] = new FormControl(
        category.checked,
      );
    });
    YEARS.forEach((category: DropDownType) => {
      yearGroup[`year_${category.value}`] = new FormControl(category.checked);
    });
    MONTHS.forEach((category: DropDownType) => {
      monthsGroup[`month_${category.value}`] = new FormControl(
        category.checked,
      );
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
      this.categoryTitle = 'Payement Method';
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
    this.dialogRef.close({data: null})
  }
  submit() {
    const filterParams: any = {'categories': [], 'subcategories': [], 'payment_methods': [], 'years': [], 'months': []};
    filterParams['categories'] = this.extractParams(this.mainCategoryForm.value);
    filterParams['subcategories'] = this.extractParams(this.subCategoryForm.value);
    filterParams['payment_methods'] = this.extractParams(this.paymentMethodForm.value);
    filterParams['years'] = this.extractParams(this.yearForm.value);
    filterParams['months'] = this.extractParams(this.monthsForm.value);
    this.dialogRef.close({ data: filterParams });
  }
}
