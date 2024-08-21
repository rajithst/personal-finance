import { Component, inject, OnInit } from '@angular/core';
import {
  faCreditCard,
  faLayerGroup,
  faShop,
} from '@fortawesome/free-solid-svg-icons';
import {
  NA_CATEGORY_ID,
  NA_SUB_CATEGORY_ID,
  PAYMENT_CATEGORY_ID,
  SAVINGS_CATEGORY_ID,
} from '../../../data/client.data';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { INCOME, PAYMENT, SAVING } from '../../../data/shared.data';
import { TransactionFilter } from '../../model/transactions';
import { LoadingService } from '../../../shared/loading/loading.service';
import { DataService } from '../../service/data.service';
import {Account, IncomeCategory, TransactionCategory, TransactionSubCategory} from "../../model/common";

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

  private formBuilder = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<TransactionFilterComponent>);
  private loadingService = inject(LoadingService);
  private data: TransactionFilterData = inject(MAT_DIALOG_DATA);
  private dataService = inject(DataService);

  filterParams: TransactionFilter;
  clickedType: string = 'categories';
  categoryTitle = 'Categories';
  subCategoryTitle: string = 'Sub Categories';

  TRANSACTION_CATEGORIES: TransactionCategory[] = this.dataService.getClientSettings().transaction_categories;
  TRANSACTION_SUB_CATEGORIES: TransactionSubCategory[] = this.dataService.getClientSettings().transaction_sub_categories;
  PAYMENT_METHODS: Account[] = this.dataService.getClientSettings().accounts;
  INCOME_CATEGORIES: IncomeCategory[] = this.dataService.getClientSettings().income_categories;

  transactionCategories: TransactionCategory[] = this.dataService.getClientSettings().transaction_categories;
  transactionSubCategories: TransactionSubCategory[] = this.dataService.getClientSettings().transaction_sub_categories;
  paymentMethods = this.dataService.getClientSettings().accounts;
  selectedCategory: number = NA_SUB_CATEGORY_ID;
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
      this.transactionCategories = this.TRANSACTION_CATEGORIES.filter(
        (x) => x.id === PAYMENT_CATEGORY_ID,
      );
      this.transactionSubCategories = this.TRANSACTION_SUB_CATEGORIES.filter((x) => x.category === PAYMENT_CATEGORY_ID);

    } else if (this.filterParams?.target === SAVING) {
      this.transactionCategories = this.TRANSACTION_CATEGORIES.filter(
        (x) => x.id === SAVINGS_CATEGORY_ID,
      );
      this.transactionSubCategories =
        this.TRANSACTION_SUB_CATEGORIES.filter((x) => x.category === SAVINGS_CATEGORY_ID);
    } else if (this.filterParams?.target === INCOME) {
      this.transactionCategories = this.INCOME_CATEGORIES;
      this.transactionSubCategories = [];
    } else {
      const firstCategory = this.TRANSACTION_CATEGORIES.at(0);
      this.transactionSubCategories = this.TRANSACTION_SUB_CATEGORIES.filter((x) => x.category === (firstCategory ? firstCategory.id : NA_CATEGORY_ID));
      this.subCategoryTitle = firstCategory ? firstCategory.category : 'N/A'
    }

  }

  createForm() {
    const categoryGroup: any = {};
    const subCategoryGroup: any = {};
    const paymentMethodGroup: any = {};

    this.TRANSACTION_CATEGORIES.forEach((category: TransactionCategory) => {
      categoryGroup[`category_${category.id}`] = new FormControl(
        this.filterParams.categories?.includes(category.id),
      );

      this.TRANSACTION_SUB_CATEGORIES.forEach((subcategory: TransactionSubCategory) => {
        subCategoryGroup[`subcategory_${subcategory.id}`] = new FormControl(
          this.filterParams.subcategories?.includes(subcategory.id),
        );
      });
    });

    this.paymentMethods.forEach((category: Account) => {
      paymentMethodGroup[`paymentmethod_${category.id}`] = new FormControl(
        this.filterParams.paymentMethods?.includes(category.id),
      );
    });

    this.mainCategoryForm = this.formBuilder.group(categoryGroup);
    this.subCategoryForm = this.formBuilder.group(subCategoryGroup);
    this.paymentMethodForm = this.formBuilder.group(paymentMethodGroup);
  }

  clickOnOption(filterType: string, filterOption: TransactionCategory | IncomeCategory) {
    this.selectedCategory = filterOption.id;
    this.subCategoryTitle = filterOption.category;
    if (filterType == 'categories' && this.filterParams.target !== INCOME) {
      this.transactionSubCategories = this.TRANSACTION_SUB_CATEGORIES.filter((x) => x.category === filterOption.id);
    }
  }

  clickOnMainFilter(filterType: string) {
    this.clickedType = filterType;
    if (filterType == 'categories') {
      this.categoryTitle = 'Categories';
      const firstCategory = this.transactionCategories.at(0);
      this.selectedCategory = firstCategory ? firstCategory.id : NA_CATEGORY_ID;
      this.subCategoryTitle = firstCategory ? firstCategory.category : 'N/A';
      this.transactionSubCategories =
        this.TRANSACTION_SUB_CATEGORIES.filter((x) => x.category === this.selectedCategory);
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
