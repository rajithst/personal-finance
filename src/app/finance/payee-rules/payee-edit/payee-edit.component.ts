import {Component, inject, Inject, OnInit} from '@angular/core';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
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
import {MatChipEditedEvent, MatChipInputEvent} from "@angular/material/chips";
import {ApiService} from "../../../core/api.service";

interface PayeeEditDialogData {
  payee: DestinationMap;
}
@Component({
  selector: 'app-payee-edit',
  templateUrl: './payee-edit.component.html',
  styleUrl: './payee-edit.component.css',
})
export class PayeeEditComponent implements OnInit {

  apiService = inject(ApiService)
  readonly addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  payeeForm: FormGroup;
  keywords: string[] = [];
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
      category_text: new FormControl(payeeData.category_text),
      subcategory: new FormControl(payeeData.subcategory),
      subcategory_text: new FormControl(payeeData.subcategory_text),
      destination: new FormControl(payeeData.destination),
      destination_or: new FormControl(payeeData.destination),
      destination_eng: new FormControl(payeeData.destination_eng),
    });
    if (this.data.payee.keywords) {
      this.keywords = this.data.payee.keywords.split(',')
    }
    this.EXPENSE_SUB_CATEGORIES =
      TRANSACTION_SUB_CATEGORIES[payeeData.category!];

    this.payeeForm.get('category')?.valueChanges.subscribe((value) => {
      if (value) {
        this.EXPENSE_SUB_CATEGORIES = TRANSACTION_SUB_CATEGORIES[value];
        this.payeeForm.get('is_saving')?.setValue(value === SAVINGS_CATEGORY_ID)
      }
    });
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.keywords.push(value);
    }
    event.chipInput!.clear();
  }

  remove(keyword: string): void {
    const index = this.keywords.indexOf(keyword);
    if (index > 0) {
      this.keywords.splice(index, 1);
    }
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
    return this.keywords;
  }

  submit() {
    const formValues = this.payeeForm.value;
    formValues['keywords'] = this.keywords.join(',')
    delete formValues['destination_or']
    this.apiService.updatePayeeRules(formValues).subscribe((payee: DestinationMap) => {
      console.log(payee)
    });
  }

  cancel() {}
}
