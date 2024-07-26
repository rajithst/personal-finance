import { Component, inject, OnInit } from '@angular/core';
import {
  faCalendar,
  faCreditCard,
  faLayerGroup,
  faShop,
} from '@fortawesome/free-solid-svg-icons';
import {
  INCOME_CATEGORIES,
  NA_CATEGORY_ID,
  NA_SUB_CATEGORY_ID,
  PAYMENT_CATEGORY_ID,
  PAYMENT_METHODS,
  SAVINGS_CATEGORY_ID,
  TRANSACTION_CATEGORIES,
  TRANSACTION_SUB_CATEGORIES,
} from '../../data/client.data';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DropDownType, INCOME, PAYMENT, SAVING } from '../../data/shared.data';
import { TransactionFilter } from '../model/transactions';
import { LoadingService } from '../../shared/loading/loading.service';
import { DataService } from '../service/data.service';

interface TransactionFilterData {
  filterParams: TransactionFilter;
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

  private formBuilder = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<TransactionFilterComponent>);
  private loadingService = inject(LoadingService);
  private data: TransactionFilterData = inject(MAT_DIALOG_DATA);
  private dataService = inject(DataService);

  filterParams: TransactionFilter;
  clickedType: string = 'categories';
  categoryTitle = 'Categories';
  subCategoryTitle =
    TRANSACTION_SUB_CATEGORIES[NA_SUB_CATEGORY_ID][0].viewValue;
  selectedCategory: number = NA_SUB_CATEGORY_ID;
  transactionCategories: DropDownType[] = TRANSACTION_CATEGORIES;
  transactionSubCategories: DropDownType[] =
    TRANSACTION_SUB_CATEGORIES[NA_SUB_CATEGORY_ID];
  paymentMethods = PAYMENT_METHODS;
  mainCategoryForm: FormGroup;
  subCategoryForm: FormGroup;
  paymentMethodForm: FormGroup;

  ngOnInit() {
    this.filterParams = this.data.filterParams;
    this.modifyFilterOptions();
    this.createForm();
  }

  modifyFilterOptions() {
    if (this.filterParams?.target === PAYMENT) {
      this.transactionCategories = TRANSACTION_CATEGORIES.filter(
        (x) => x.value === PAYMENT_CATEGORY_ID,
      );
      this.transactionSubCategories =
        TRANSACTION_SUB_CATEGORIES[PAYMENT_CATEGORY_ID];
    } else if (this.filterParams?.target === SAVING) {
      this.transactionCategories = TRANSACTION_CATEGORIES.filter(
        (x) => x.value === SAVINGS_CATEGORY_ID,
      );
      this.transactionSubCategories =
        TRANSACTION_SUB_CATEGORIES[SAVINGS_CATEGORY_ID];
    } else if (this.filterParams?.target === INCOME) {
      this.transactionCategories = INCOME_CATEGORIES;
      this.transactionSubCategories = [];
    }
    this.subCategoryTitle =
      this.transactionSubCategories.length > 0
        ? this.transactionSubCategories[0].viewValue
        : '';
  }

  createForm() {
    const categoryGroup: any = {};
    const subCategoryGroup: any = {};
    const paymentMethodGroup: any = {};

    TRANSACTION_CATEGORIES.forEach((category: DropDownType) => {
      categoryGroup[`category_${category.value}`] = new FormControl(
        this.filterParams.categories?.includes(category.value),
      );
      const subCategories = TRANSACTION_SUB_CATEGORIES[category.value];
      subCategories.forEach((subcategory: DropDownType) => {
        subCategoryGroup[`subcategory_${subcategory.value}`] = new FormControl(
          this.filterParams.subcategories?.includes(subcategory.value),
        );
      });
    });

    PAYMENT_METHODS.forEach((category: DropDownType) => {
      paymentMethodGroup[`paymentmethod_${category.value}`] = new FormControl(
        this.filterParams.paymentMethods?.includes(category.value),
      );
    });

    this.mainCategoryForm = this.formBuilder.group(categoryGroup);
    this.subCategoryForm = this.formBuilder.group(subCategoryGroup);
    this.paymentMethodForm = this.formBuilder.group(paymentMethodGroup);
  }

  clickOnOption(filterType: string, filterOption: DropDownType) {
    this.selectedCategory = filterOption.value;
    this.subCategoryTitle = filterOption.viewValue;
    if (filterType == 'categories' && this.filterParams.target !== INCOME) {
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
      this.selectedCategory = NA_CATEGORY_ID;
      this.transactionSubCategories =
        TRANSACTION_SUB_CATEGORIES[NA_SUB_CATEGORY_ID];
    } else if (filterType == 'payment_method') {
      this.categoryTitle = 'Payment Method';
      this.subCategoryTitle = '';
    } else if (filterType == 'payee') {
      this.categoryTitle = 'Payee';
      this.subCategoryTitle = '';
    }
  }

  private extractParams(dataSource: any) {
    const results: number[] = [];
    Object.keys(dataSource).forEach((x) => {
      const isChecked = dataSource[x];
      if (isChecked) {
        const value = x.split('_');
        results.push(Number(value[1]));
      }
    });
    return results;
  }

  clear() {
    const filterParamsCopy = Object.assign(this.filterParams)
    filterParamsCopy.categories = [];
    filterParamsCopy.subcategories = [];
    filterParamsCopy.paymentMethods = [];
    this.dialogRef.close({
      refresh: true,
      filters: filterParamsCopy,
    });
  }
  submit() {
    this.loadingService.loadingOn();
    const filterParams: TransactionFilter = {
      year: this.dataService.getFilterYear(),
      target: this.filterParams.target,
      categories: this.extractParams(this.mainCategoryForm.value),
      subcategories: this.extractParams(this.subCategoryForm.value),
      paymentMethods: this.extractParams(this.paymentMethodForm.value),
    };
    this.dialogRef.close({ refresh: true, filters: filterParams });
  }

}
