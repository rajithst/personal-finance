import { Component, inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { TransactionFilter } from '../../finance/model/transactions';
import {
  TransactionCategory,
  TransactionSubCategory,
} from '../../finance/model/common';
import { CreditAccount } from '../../finance/model/account';
import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatRipple } from '@angular/material/core';
import {
  MatSelectionList,
  MatListOption,
  MatList,
  MatListItem,
} from '@angular/material/list';
import { FinanceStore } from '../../core/store/finance.store';
import {
  EXPENSE,
  INCOME,
  PAYMENT,
  SAVING,
} from '../../finance/data/client.data';
import { DataService } from '../../service/data.service';
import { Payee } from '../../finance/model/payee';

interface TransactionFilterData {
  filterParams: TransactionFilter;
  hiddenSections?: string[];
}

@Component({
  selector: 'app-transaction-filter',
  templateUrl: './transaction-filter.component.html',
  styleUrl: './transaction-filter.component.scss',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatSelectionList,
    MatListOption,
    ReactiveFormsModule,
    MatList,
    MatListItem,
    MatRipple,
    MatCheckbox,
    MatDialogActions,
    MatButton,
    MatDialogClose,
  ],
})
export class TransactionFilterComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<TransactionFilterComponent>);
  protected readonly data = inject<TransactionFilterData>(MAT_DIALOG_DATA);
  private readonly store = inject(FinanceStore);
  private readonly dataService = inject(DataService);

  filterParams: TransactionFilter;
  clickedType = '';
  categoryTitle = '';
  subCategoryTitle = '';
  selectedCategory = 0;
  mainCategoryForm: FormGroup;
  subCategoryForm: FormGroup;
  accountForm: FormGroup;
  payeeForm: FormGroup;

  TRANSACTION_CATEGORIES: TransactionCategory[] =
    this.store.transactionCategories();
  TRANSACTION_SUB_CATEGORIES: TransactionSubCategory[] =
    this.store.transactionSubCategories();
  EXPENSE_CATEGORIES: TransactionCategory[] = this.store.expenseCategories();
  INCOME_CATEGORIES: TransactionCategory[] = this.store.incomeCategories();
  SAVINGS_CATEGORIES: TransactionCategory[] = this.store.savingsCategories();
  PAYMENT_CATEGORIES: TransactionCategory[] = this.store.paymentCategories();
  transactionCategories: TransactionCategory[] = this.TRANSACTION_CATEGORIES;
  payees: Payee[] = this.store.payees();

  accounts = this.store.creditAccounts();
  transactionSubCategories: TransactionSubCategory[] =
    this.TRANSACTION_SUB_CATEGORIES;

  constructor() {
    this.mainCategoryForm = this.formBuilder.group({});
    this.subCategoryForm = this.formBuilder.group({});
    this.accountForm = this.formBuilder.group({});
    this.payeeForm = this.formBuilder.group({});
  }

  ngOnInit() {
    this.preparePayees().then(() => {
      this.filterParams = this.data.filterParams;
      this.modifyFilterOptions();
      this.createForm();
      this.clickedType = 'categories';
      this.categoryTitle = 'Categories';
      this.subCategoryTitle = 'Sub Categories';
    });
  }

  async preparePayees() {
    if (this.payees.length == 0) {
      await this.store.getPayees();
      this.payees = this.store.payees();
    }
  }

  modifyFilterOptions() {
    if (this.filterParams?.target === PAYMENT) {
      this.transactionCategories = [
        ...this.PAYMENT_CATEGORIES,
        ...this.EXPENSE_CATEGORIES,
      ];
    } else if (this.filterParams?.target === SAVING) {
      this.transactionCategories = this.SAVINGS_CATEGORIES;
    } else if (this.filterParams?.target === INCOME) {
      this.transactionCategories = this.INCOME_CATEGORIES;
    } else if (this.filterParams?.target === EXPENSE) {
      this.transactionCategories = this.EXPENSE_CATEGORIES;
    }
    const firstCategory = this.transactionCategories.at(0);
    this.transactionSubCategories = this.getTransactionSubCategories(
      firstCategory ? firstCategory.id : 0,
    );
    this.subCategoryTitle = firstCategory ? firstCategory.category : 'N/A';
  }

  createForm() {
    const categoryGroup: any = {};
    const subCategoryGroup: any = {};
    const accountsGroup: any = {};
    const payeeGroup: any = {};

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

    this.accounts.forEach((category: CreditAccount) => {
      accountsGroup[`account_${category.id}`] = new FormControl(
        this.filterParams.accounts?.includes(category.id),
      );
    });

    this.payees.forEach((payee: Payee) => {
      payeeGroup[`payee_${payee.id}`] = new FormControl(
        this.filterParams.payees?.includes(payee.id),
      );
    });

    this.mainCategoryForm = this.formBuilder.group(categoryGroup);
    this.subCategoryForm = this.formBuilder.group(subCategoryGroup);
    this.accountForm = this.formBuilder.group(accountsGroup);
    this.payeeForm = this.formBuilder.group(payeeGroup);
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
      this.selectedCategory = firstCategory ? firstCategory.id : 0;
      this.subCategoryTitle = firstCategory ? firstCategory.category : 'N/A';
      this.transactionSubCategories = this.getTransactionSubCategories(
        this.selectedCategory,
      );
    } else if (filterType == 'accounts') {
      this.categoryTitle = 'Accounts';
      this.subCategoryTitle = '';
    } else if (filterType == 'payee') {
      this.categoryTitle = 'Payees';
      this.subCategoryTitle = '';
    }
  }

  clear() {
    const filterParamsCopy = Object.assign(this.filterParams);
    filterParamsCopy.categories = [];
    filterParamsCopy.subcategories = [];
    filterParamsCopy.paymentMethods = [];
    filterParamsCopy.payees = [];
    this.dialogRef.close({
      refresh: true,
      filters: filterParamsCopy,
    });
  }

  submit() {
    const filterParams: TransactionFilter = {
      year: this.dataService.getFilterYear(),
      target: this.filterParams.target,
      categories: this.extractParams(this.mainCategoryForm.value),
      subcategories: this.extractParams(this.subCategoryForm.value),
      accounts: this.extractParams(this.accountForm.value),
      payees: this.extractParams(this.payeeForm.value)
    };
    this.dialogRef.close({ refresh: true, filters: filterParams });
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
}
