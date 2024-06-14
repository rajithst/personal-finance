import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { DestinationMap } from '../../model/payee';
import {
  SAVINGS_CATEGORY_ID,
  TRANSACTION_CATEGORIES, TRANSACTION_SUB_CATEGORIES,
} from '../../../data/client.data';
import {FormControl, FormGroup} from '@angular/forms';
import { DropDownType } from '../../../data/shared.data';

interface PayeeEditDialogData {
  payee: DestinationMap;
  keywords: string[];
}
@Component({
  selector: 'app-payee-edit',
  templateUrl: './payee-edit.component.html',
  styleUrl: './payee-edit.component.css',
})
export class PayeeEditComponent implements OnInit {
  payeeForm: FormGroup;
  keywords = '';
  protected TRANSACTION_CATEGORIES: DropDownType[] = TRANSACTION_CATEGORIES;
  protected EXPENSE_SUB_CATEGORIES: DropDownType[] = [];

  constructor(
    public dialogRef: MatDialogRef<PayeeEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PayeeEditDialogData,
  ) {}

  ngOnInit(): void {
    const payeeData = this.data.payee;
    this.payeeForm = new FormGroup({
      id: new FormControl(payeeData.id),
      category: new FormControl(payeeData.category),
      subcategory: new FormControl(payeeData.subcategory),
      destination: new FormControl(payeeData.destination),
      alias: new FormControl(payeeData.destination_eng),
    });
    this.EXPENSE_SUB_CATEGORIES =
      TRANSACTION_SUB_CATEGORIES[payeeData.category!];

    this.payeeForm.get('category')?.valueChanges.subscribe((value) => {
      if (value) {
        this.EXPENSE_SUB_CATEGORIES = TRANSACTION_SUB_CATEGORIES[value];
        this.payeeForm.get('is_saving')?.setValue(value === SAVINGS_CATEGORY_ID)
      }
    });
  }

  submit() {}

  cancel() {}
}
