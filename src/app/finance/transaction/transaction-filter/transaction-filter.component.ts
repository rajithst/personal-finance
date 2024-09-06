import { Component, inject, OnInit } from '@angular/core';
import {
  faCreditCard,
  faLayerGroup,
  faShop,
} from '@fortawesome/free-solid-svg-icons';
import { NA_CATEGORY_ID, NA_SUB_CATEGORY_ID } from '../../../data/client.data';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { INCOME, PAYMENT, SAVING } from '../../../data/shared.data';
import { TransactionFilter } from '../../model/transactions';
import { LoadingService } from '../../../shared/loading/loading.service';
import { DataService } from '../../service/data.service';
import {
  Account,
  TransactionCategory,
  TransactionSubCategory,
} from '../../model/common';

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

  TRANSACTION_CATEGORIES: TransactionCategory[] =
    this.dataService.getAllCategories()
  TRANSACTION_SUB_CATEGORIES: TransactionSubCategory[] =
    this.dataService.getAllSubCategories();

  EXPENSE_CATEGORIES:  TransactionCategory[] =
    this.dataService.getExpenseCategories();
  INCOME_CATEGORIES: TransactionCategory[] =
    this.dataService.getIncomeCategories();
  SAVINGS_CATEGORIES: TransactionCategory[] =
    this.dataService.getSavingsCategories();
  PAYMENT_CATEGORIES: TransactionCategory[] =
    this.dataService.getPaymentCategories();

  transactionCategories: TransactionCategory[] = this.TRANSACTION_CATEGORIES;
  transactionSubCategories: TransactionSubCategory[] =
    this.TRANSACTION_SUB_CATEGORIES;
  accounts = this.dataService.getClientSettings().accounts;
  selectedCategory: number = NA_SUB_CATEGORY_ID;
  mainCategoryForm: FormGroup;
  subCategoryForm: FormGroup;
  accountForm: FormGroup;

  ngOnInit() {
    this.filterParams = this.data.filterParams;
    this.modifyFilterOptions();
    this.createForm();
  }

  modifyFilterOptions() {
    if (this.filterParams?.target === PAYMENT) {
      this.transactionCategories = this.PAYMENT_CATEGORIES;
    } else if (this.filterParams?.target === SAVING) {
      this.transactionCategories = this.SAVINGS_CATEGORIES;
    } else if (this.filterParams?.target === INCOME) {
      this.transactionCategories = this.INCOME_CATEGORIES;
    } else {
      this.transactionCategories = this.EXPENSE_CATEGORIES;
    }
    const firstCategory = this.transactionCategories.at(0);
    this.transactionSubCategories = this.getTransactionSubCategories(
      firstCategory ? firstCategory.id : NA_CATEGORY_ID,
    );
    this.subCategoryTitle = firstCategory ? firstCategory.category : 'N/A';
  }

  createForm() {
    const categoryGroup: any = {};
    const subCategoryGroup: any = {};
    const accountsGroup: any = {};

    this.TRANSACTION_CATEGORIES.forEach((category: TransactionCategory) => {
      categoryGroup[`category_${category.id}`] = new FormControl(
        this.filterParams.categories?.includes(category.id),
      );

      this.TRANSACTION_SUB_CATEGORIES.forEach(
        (subcategory: TransactionSubCategory) => {
          subCategoryGroup[`subcategory_${subcategory.id}`] = new FormControl(
            this.filterParams.subcategories?.includes(subcategory.id),
          );
        },
      );
    });

    this.accounts.forEach((category: Account) => {
      accountsGroup[`account_${category.id}`] = new FormControl(
        this.filterParams.accounts?.includes(category.id),
      );
    });

    this.mainCategoryForm = this.formBuilder.group(categoryGroup);
    this.subCategoryForm = this.formBuilder.group(subCategoryGroup);
    this.accountForm = this.formBuilder.group(accountsGroup);
  }

  clickOnOption(filterType: string, filterOption: TransactionCategory) {
    this.selectedCategory = filterOption.id;
    this.subCategoryTitle = filterOption.category;
    if (filterType == 'categories') {
      this.transactionSubCategories = this.getTransactionSubCategories(
        filterOption.id,
      );
    }
  }

  clickOnMainFilter(filterType: string) {
    this.clickedType = filterType;
    if (filterType == 'categories') {
      this.categoryTitle = 'Categories';
      const firstCategory = this.transactionCategories.at(0);
      this.selectedCategory = firstCategory ? firstCategory.id : NA_CATEGORY_ID;
      this.subCategoryTitle = firstCategory ? firstCategory.category : 'N/A';
      this.transactionSubCategories = this.getTransactionSubCategories(
        this.selectedCategory,
      );
    } else if (filterType == 'accounts') {
      this.categoryTitle = 'Accounts';
      this.subCategoryTitle = '';
    } else if (filterType == 'payee') {
      this.categoryTitle = 'Payee';
      this.subCategoryTitle = '';
    }
  }

  private getTransactionSubCategories(targetCategory: number) {
    return this.TRANSACTION_SUB_CATEGORIES.filter(
      (x) => x.category === targetCategory,
    );
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
    const filterParamsCopy = Object.assign(this.filterParams);
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
      accounts: this.extractParams(this.accountForm.value),
    };
    this.dialogRef.close({ refresh: true, filters: filterParams });
  }
}
