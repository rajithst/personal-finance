import { Component, inject, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TransactionExpand } from '../../model/transactions';
import { FormBuilder, FormControl, FormGroup, FormArray } from '@angular/forms';
import {
  NA_CATEGORY_ID,
  TRANSACTION_CATEGORIES,
  TRANSACTION_SUB_CATEGORIES,
} from '../../../data/client.data';
import { DropDownType } from '../../../data/shared.data';

export interface TransactionSplitData {
  formData: TransactionExpand;
}

@Component({
  selector: 'app-transaction-split',
  templateUrl: './transaction-split.component.html',
  styleUrl: './transaction-split.component.css',
})
export class TransactionSplitComponent implements OnInit, OnDestroy {
  private formBuilder = inject(FormBuilder);

  TRANSACTION_CATEGORIES = TRANSACTION_CATEGORIES;
  EXPENSE_SUB_CATEGORIES: DropDownType[] = [];
  splitForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<TransactionSplitComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TransactionSplitData,
  ) {}

  get splits(): FormControl[] {
    return (this.splitForm.get('splits') as FormArray)
      .controls as FormControl[];
  }
  ngOnInit(): void {
    this.splitForm = this.formBuilder.group({
      splits: this.formBuilder.array([this.getNewFormArray()]),
    });
    this.EXPENSE_SUB_CATEGORIES = TRANSACTION_SUB_CATEGORIES[NA_CATEGORY_ID];
  }

  onAddSplit() {
    (<FormArray>this.splitForm.get('splits')).push(this.getNewFormArray());
  }

  private getNewFormArray() {
    return new FormGroup({
      category: new FormControl(null),
      subcategory: new FormControl(null),
      amount: new FormControl(null),
    });
  }

  cancel() {}

  submit() {}

  ngOnDestroy(): void {}
}
