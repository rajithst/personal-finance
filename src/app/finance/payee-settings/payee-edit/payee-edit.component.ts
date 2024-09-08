import { Component, inject, Inject, OnInit } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DestinationMap } from '../../model/payee';
import {
  TRANSACTION_TYPE_EXPENSE_ID,
  TRANSACTION_TYPE_INCOME_ID,
  TRANSACTION_TYPE_PAYMENTS_ID,
  TRANSACTION_TYPE_SAVINGS_ID,
  TRANSACTION_TYPES,
} from '../../../data/client.data';
import { FormControl, FormGroup } from '@angular/forms';
import { MatChipEditedEvent, MatChipInputEvent } from '@angular/material/chips';
import { ApiService } from '../../../core/api.service';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { DataService } from '../../service/data.service';
import {
  TransactionCategory,
  TransactionSubCategory,
} from '../../model/common';

interface PayeeEditDialogData {
  payee: DestinationMap;
}
@Component({
  selector: 'app-payee-edit',
  templateUrl: './payee-edit.component.html',
  styleUrl: './payee-edit.component.css',
})
export class PayeeEditComponent implements OnInit {
  readonly addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  protected readonly TRANSACTION_TYPES = TRANSACTION_TYPES;

  private apiService = inject(ApiService);
  private dataService = inject(DataService);
  protected TRANSACTION_CATEGORIES: TransactionCategory[] =
    this.dataService.getAllCategories();
  protected TRANSACTION_SUB_CATEGORIES: TransactionSubCategory[] =
    this.dataService.getAllSubCategories();
  protected EXPENSE_SUB_CATEGORIES: TransactionSubCategory[] = [];

  transactionCategories: TransactionCategory[] = [];
  transactionSubCategories: TransactionSubCategory[] = [];

  private EXPENSE_CATEGORIES: TransactionCategory[] =
    this.dataService.getExpenseCategories();
  private INCOME_CATEGORIES: TransactionCategory[] =
    this.dataService.getIncomeCategories();
  private SAVINGS_CATEGORIES: TransactionCategory[] =
    this.dataService.getSavingsCategories();
  private PAYMENT_CATEGORIES: TransactionCategory[] =
    this.dataService.getPaymentCategories();

  payeeForm: FormGroup;
  keywords: string[] = [];
  displayedColumns: string[] = ['select', 'Payee', 'Category', 'SubCategory'];
  dataSource: MatTableDataSource<DestinationMap>;
  selection = new SelectionModel<DestinationMap>(true, []);

  constructor(
    public dialogRef: MatDialogRef<PayeeEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PayeeEditDialogData,
  ) {}

  ngOnInit(): void {
    const payeeData = this.data.payee;
    const payeeCategory = payeeData.category;
    const transactionType = this.TRANSACTION_CATEGORIES.find(
      (x) => x.id === payeeCategory,
    );
    this.payeeForm = new FormGroup({
      id: new FormControl(payeeData.id),
      category_type: new FormControl(payeeData.category_type),
      category: new FormControl(payeeData.category),
      subcategory: new FormControl(payeeData.subcategory),
      category_text: new FormControl(payeeData.category_text),
      subcategory_text: new FormControl(payeeData.subcategory_text),
      destination: new FormControl(payeeData.destination),
      destination_original: new FormControl(payeeData.destination_original),
      destination_eng: new FormControl(payeeData.destination_eng),
    });
    if (this.data.payee.keywords) {
      this.keywords = this.data.payee.keywords.split(',');
    }
    this.setTransactionCategories(transactionType!.category_type);
    this.setTransactionSubCategories(payeeData.category);

    this.payeeForm.get('category')?.valueChanges.subscribe((value) => {
      if (value) {
        this.setTransactionSubCategories(value);
      }
    });
    this.payeeForm.get('category_type')?.valueChanges.subscribe((value) => {
      this.payeeForm.get('subcategory')?.setValue(null);
      this.payeeForm.get('category')?.setValue(null);
      this.setTransactionCategories(value);
    });
    this.updateRelatedPayees();
  }

  updateRelatedPayees() {
    const relatedPayees = this.dataService
      .getPayees()

      const similarPayees = relatedPayees.filter(
      (x) =>
        x.id !== this.data.payee.id &&
        x.destination_original &&
        this.keywords.some((item) =>
          x.destination_original.toLowerCase().includes(item.toLowerCase()),
        ),
    );
    this.dataSource = new MatTableDataSource<DestinationMap>(similarPayees);
    this.selection.clear();
    this.selection.select(...this.dataSource.data);
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (this.keywords.includes(value)) {
      event.chipInput!.clear();
      return;
    }
    if (value) {
      this.keywords.push(value);
    }
    event.chipInput!.clear();
    this.updateRelatedPayees();
  }

  remove(keyword: string): void {
    const index = this.keywords.indexOf(keyword);
    if (index !== -1) {
      this.keywords.splice(index, 1);
    }
    this.updateRelatedPayees();
  }

  edit(keyword: string, event: MatChipEditedEvent) {
    const value = event.value.trim();
    if (!value) {
      this.remove(keyword);
      return;
    }
    const index = this.keywords.indexOf(keyword);
    if (index >= 0) {
      this.keywords[index] = value;
      return [...this.keywords];
    }
    this.updateRelatedPayees();
    return this.keywords;
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.dataSource.data);
  }

  submit() {
    const formValues = this.payeeForm.value;
    formValues['keywords'] = this.keywords.join(',');
    formValues['merge_ids'] = this.selection.selected.map((x) => x.id);
    this.apiService
      .updatePayeeRules(formValues)
      .subscribe((payee: DestinationMap) => {
        if (payee && payee.id) {
          this.dialogRef.close({
            payee: payee,
            mergeIds: formValues['merge_ids'],
          });
        } else {
          this.dialogRef.close({ payee: null, mergeIds: null });
        }
      });
  }

  cancel() {
    this.dialogRef.close({ payee: null, mergeIds: null });
  }

  private setTransactionCategories(transactionType: number) {
    if (transactionType === TRANSACTION_TYPE_EXPENSE_ID) {
      this.transactionCategories = this.EXPENSE_CATEGORIES;
    } else if (transactionType === TRANSACTION_TYPE_INCOME_ID) {
      this.transactionCategories = this.INCOME_CATEGORIES;
    } else if (transactionType === TRANSACTION_TYPE_SAVINGS_ID) {
      this.transactionCategories = this.SAVINGS_CATEGORIES;
    } else if (transactionType === TRANSACTION_TYPE_PAYMENTS_ID) {
      this.transactionCategories = [
        ...this.PAYMENT_CATEGORIES,
        ...this.EXPENSE_CATEGORIES,
      ];
    }
    if (this.transactionCategories.length === 1) {
      this.payeeForm
        .get('category')
        ?.setValue(this.transactionCategories.at(0)!.id);
    }
  }

  private setTransactionSubCategories(category: number) {
    this.transactionSubCategories = this.TRANSACTION_SUB_CATEGORIES.filter(
      (x) => x.category === category,
    );
    if (this.transactionSubCategories.length === 1) {
      this.payeeForm
        .get('subcategory')
        ?.setValue(this.transactionSubCategories.at(0)!.id);
    }
  }
}
