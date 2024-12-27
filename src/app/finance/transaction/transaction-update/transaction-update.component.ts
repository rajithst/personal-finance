import { Component, inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
  MAT_DIALOG_DEFAULT_OPTIONS,
  MatDialog,
} from '@angular/material/dialog';

import {
  DropDownType,
  TRANSACTION_TYPE_EXPENSE_ID,
  TRANSACTION_TYPE_INCOME_ID,
  TRANSACTION_TYPE_PAYMENTS_ID,
  TRANSACTION_TYPE_SAVINGS_ID,
  TRANSACTION_TYPES,
} from '../../data/client.data';
import {
  TransactionExpand,
  TransactionMergeRequest,
  TransactionRequest,
} from '../../model/transactions';
import moment from 'moment/moment';
import { ApiService } from '../../../core/api.service';
import {
  TransactionCategory,
  TransactionSubCategory,
} from '../../model/common';
import { CreditAccount } from '../../model/account';
import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatDivider } from '@angular/material/divider';
import {
  MatDatepickerInput,
  MatDatepickerToggle,
  MatDatepicker,
} from '@angular/material/datepicker';
import { MatInput } from '@angular/material/input';
import { MatOption, provideNativeDateAdapter } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import {
  MatFormField,
  MatLabel,
  MatSuffix,
  MatPrefix,
} from '@angular/material/form-field';
import { NgIf, DecimalPipe } from '@angular/common';
import { FinanceStore } from '../../../core/store/finance.store';
import { CategoryEditComponent } from '../../settings/transaction-category/category-edit/category-edit.component';
import {
  CategorySettings,
  CategorySettingsResponse,
} from '../../model/category-settings';

export interface TransactionUpdateDialogData {
  formData: TransactionExpand;
  mergeIds: number[] | null;
  task: string;
}

@Component({
  selector: 'app-transaction-update',
  templateUrl: './transaction-update.component.html',
  styleUrl: './transaction-update.component.scss',
  imports: [
    MatDialogTitle,
    NgIf,
    MatDialogContent,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    MatInput,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatSuffix,
    MatDatepicker,
    MatPrefix,
    MatDivider,
    MatCheckbox,
    MatDialogActions,
    MatButton,
    MatDialogClose,
  ],
  providers: [
    provideNativeDateAdapter(),
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: {
        width: '900px',
        position: {
          top: '5%',
        },
      },
    },
  ],
})
export class TransactionUpdateDialog implements OnInit {
  private readonly apiService = inject(ApiService);
  private readonly dialogRef = inject(MatDialogRef<TransactionUpdateDialog>);
  private readonly dialog = inject(MatDialog);
  private readonly store = inject(FinanceStore);
  data = inject<TransactionUpdateDialogData>(MAT_DIALOG_DATA);

  readonly transactionTypes: DropDownType[] = TRANSACTION_TYPES;
  readonly accounts: CreditAccount[] = this.store.creditAccounts();
  transactionCategories: TransactionCategory[] = [
    {
      id: 0,
      category: 'Add New Category',
      category_type: 0,
      category_type_text: 'Select a category',
      description: 'Select a category',
    },
  ];
  transactionCategoriesDisplay: TransactionCategory[] = [];
  transactionSubCategoriesDisplay: TransactionSubCategory[] = [];
  transactionSubCategories: TransactionSubCategory[] = [
    {
      id: 0,
      name: 'Add New Sub Category',
      category: 0,
      category_text: 'Select a category',
      description: 'Select a category',
    },
  ];
  transactionForm: FormGroup;
  formData: TransactionExpand;

  ngOnInit(): void {
    if (
      this.data.task == 'edit' ||
      this.data.task == 'merge' ||
      this.data.task == 'delete'
    ) {
      this.formData = this.data.formData!;
      this.transactionForm = this.getNewTransactionForm(this.formData);
      const transactionType =
        this.transactionForm.get('transaction_type')?.value;
      const transactionCategory = this.transactionForm.get('category')?.value;
      this.setTransactionCategories(transactionType);
      this.setTransactionSubCategories(transactionCategory);
    } else if (this.data.task == 'add') {
      this.transactionForm = this.getNewTransactionForm(null);
    }

    this.transactionForm.get('category')?.valueChanges.subscribe((value) => {
      if (value !== null) {
        if (value === 0) {
          this.createNewCategory();
        }
        this.setTransactionSubCategories(value);
      }
    });
    this.transactionForm.get('subcategory')?.valueChanges.subscribe((value) => {
      if (value !== null && value === 0) {
        this.createNewCategory(this.transactionForm.get('category')?.value);
        this.setTransactionSubCategories(value);
      }
    });

    this.transactionForm
      .get('transaction_type')
      ?.valueChanges.subscribe((value) => {
        this.transactionForm.get('subcategory')?.setValue(null);
        this.transactionForm.get('category')?.setValue(null);
        this.setTransactionCategories(value);
      });
  }

  async submit() {
    this.transactionForm.value.date = moment(
      this.transactionForm.value.date,
    ).format('YYYY-MM-DD');
    this.transactionForm.value.amount = Number(
      this.transactionForm.value.amount,
    );

    if (
      this.data.task == 'edit' ||
      this.data.task == 'add' ||
      this.data.task == 'delete'
    ) {
      const payload: TransactionRequest = this.transactionForm.value;
      const updatedTransaction =
        await this.apiService.updateTransaction(payload);
      this.dialogRef.close({
        data: updatedTransaction ?? null,
        status: !!updatedTransaction,
      });
    } else if (this.data.task == 'merge') {
      const data = this.transactionForm.value;
      const payload: TransactionMergeRequest = {
        ...data,
        merge_ids: this.data.mergeIds,
      };
      const updatedTransaction =
        await this.apiService.mergeTransaction(payload);
      this.dialogRef.close({
        data: updatedTransaction ?? null,
        status: !!updatedTransaction,
      });
    }
  }

  createNewCategory(category: number | null = null) {
    let categorySetting: CategorySettings | null = null;
    if (category) {
      const targetCategory = this.store
        .transactionCategories()
        .find((x) => x.id === category);
      const targetSubCategories = this.store
        .transactionSubCategories()
        .filter((x) => x.category === category);
      categorySetting = {
        category: targetCategory!,
        subCategories: targetSubCategories,
      };
    }
    const dialog = this.dialog.open(CategoryEditComponent, {
      maxWidth: '850px',
      position: {
        top: '5%',
      },
      data: {
        settings: category ? categorySetting : null,
        task: category ? 'edit' : 'add',
      },
    });
    dialog
      .afterClosed()
      .subscribe((result: CategorySettingsResponse | null | undefined) => {
        const transactionType =
          this.transactionForm.get('transaction_type')?.value;
        if (result !== undefined && result !== null) {
          this.transactionForm.get('category')?.setValue(result.category?.id);
          this.setTransactionCategories(transactionType);
          this.setTransactionSubCategories(result.category?.id ?? 0);
        } else if (category) {
          this.transactionForm.get('subcategory')?.setValue(null);
          this.setTransactionSubCategories(category);
        } else {
          this.transactionForm.get('category')?.setValue(null);
          this.setTransactionCategories(transactionType);
        }
      });
  }

  cancel() {
    this.dialogRef.close({ data: null, status: true });
  }

  getNewTransactionForm(data: TransactionExpand | null) {
    console.log('data', data);
    let transactionType = null;
    if (data) {
      if (data.is_payment) {
        transactionType = TRANSACTION_TYPE_PAYMENTS_ID;
      } else if (data.is_saving) {
        transactionType = TRANSACTION_TYPE_SAVINGS_ID;
      } else if (data.is_income) {
        transactionType = TRANSACTION_TYPE_INCOME_ID;
      } else {
        transactionType = TRANSACTION_TYPE_EXPENSE_ID;
      }
    }
    return new FormGroup({
      id: new FormControl<number | null>(data ? data.id : null),
      category: new FormControl<number | null>(data ? data.category : null),
      subcategory: new FormControl<number | null>(
        data ? data.subcategory : null,
      ),
      account: new FormControl<number | null>(data ? data.account : null, [
        Validators.required,
      ]),
      amount: new FormControl<number | null>(data ? data.amount : null, [
        Validators.required,
      ]),
      date: new FormControl<string | null>(data ? data.date : null, [
        Validators.required,
      ]),
      destination: new FormControl<string | null>(
        data ? data.destination : null,
        [Validators.required],
      ),
      alias: new FormControl<string | null>(data ? data.alias : null),
      notes: new FormControl<string | null>(data ? data.notes : null),
      transaction_type: new FormControl<number | null>(
        data ? transactionType : null,
        [Validators.required],
      ),
      update_similar: new FormControl<boolean>(false),
      is_payment: new FormControl<boolean>(data ? data.is_payment : false),
      is_income: new FormControl<boolean>(data ? data.is_income : false),
      is_saving: new FormControl<boolean>(data ? data.is_saving : false),
      is_expense: new FormControl<boolean>(data ? data.is_expense : true),
      is_deleted: new FormControl<boolean>(data ? data.is_deleted : false),
      is_merge: new FormControl<boolean>(data ? data.is_merge : false),
      merge_id: new FormControl<number | null>(data ? data.merge_id : null),
      delete_reason: new FormControl<string | null>(
        data ? data.delete_reason : null,
      ),
      source: new FormControl<number | null>(data ? data.source : 2),
    });
  }

  private setTransactionSubCategories(category: number) {
    this.transactionSubCategoriesDisplay = [
      ...this.transactionSubCategories,
      ...this.store
        .transactionSubCategories()
        .filter((x) => x.category === category),
    ];
  }

  private setTransactionCategories(transactionType: number) {
    if (transactionType === TRANSACTION_TYPE_EXPENSE_ID) {
      this.transactionCategoriesDisplay = [
        ...this.transactionCategories,
        ...this.store.expenseCategories(),
      ];
      this.transactionForm.get('is_payment')?.setValue(false);
      this.transactionForm.get('is_saving')?.setValue(false);
      this.transactionForm.get('is_expense')?.setValue(true);
      this.transactionForm.get('is_income')?.setValue(false);
    } else if (transactionType === TRANSACTION_TYPE_INCOME_ID) {
      this.transactionCategoriesDisplay = [
        ...this.transactionCategories,
        ...this.store.incomeCategories(),
      ];
      this.transactionForm.get('is_expense')?.setValue(false);
      this.transactionForm.get('is_payment')?.setValue(false);
      this.transactionForm.get('is_saving')?.setValue(false);
      this.transactionForm.get('is_income')?.setValue(true);
    } else if (transactionType === TRANSACTION_TYPE_SAVINGS_ID) {
      this.transactionCategoriesDisplay = [
        ...this.transactionCategories,
        ...this.store.savingsCategories(),
      ];
      this.transactionForm.get('is_expense')?.setValue(true);
      this.transactionForm.get('is_payment')?.setValue(false);
      this.transactionForm.get('is_saving')?.setValue(true);
      this.transactionForm.get('is_income')?.setValue(false);
    } else if (transactionType === TRANSACTION_TYPE_PAYMENTS_ID) {
      this.transactionCategoriesDisplay = [
        ...this.transactionCategories,
        ...this.store.paymentCategories(),
        ...this.store.expenseCategories(),
      ];
      this.transactionForm.get('is_expense')?.setValue(true);
      this.transactionForm.get('is_payment')?.setValue(true);
      this.transactionForm.get('is_saving')?.setValue(false);
      this.transactionForm.get('is_income')?.setValue(false);
    }
  }
}

@Component({
  selector: 'app-transaction-delete',
  templateUrl: './transaction-delete.component.html',
  styleUrl: './transaction-delete.component.scss',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatFormField,
    MatInput,
    ReactiveFormsModule,
    FormsModule,
    MatDialogActions,
    MatButton,
    MatDialogClose,
    DecimalPipe,
  ],
})
export class TransactionDeleteDialog extends TransactionUpdateDialog {
  deleteReason: string = '';

  confirm() {
    this.transactionForm.get('is_deleted')?.setValue(true);
    this.transactionForm.get('delete_reason')?.setValue(this.deleteReason);
    this.submit();
  }
}
