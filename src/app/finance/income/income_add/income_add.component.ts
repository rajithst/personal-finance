import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import moment from 'moment';
import {
  SessionEventMessage,
  SessionService,
} from '../../../core/session.service';
import { Income, IncomeRequest } from '../../../shared/interface/income.data';
import { INCOME_CATEGORIES } from '../../../shared/static/client_data';
import { DropDownType } from '../../../shared/interface/common.data';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface IncomeDialogData {
  formData: Income | null;
}

@Component({
  selector: 'app-income-add',
  templateUrl: './income_add.component.html',
  styleUrl: './income_add.component.css',
})
export class IncomeDialog implements OnInit {
  private message = this.sessionService.getEventMessage();
  incomeTypes: DropDownType[] = INCOME_CATEGORIES;

  incomeForm = new FormGroup({
    id: new FormControl<number | null>(null),
    category: new FormControl<number>(0, Validators.required),
    amount: new FormControl<number | null>(null, Validators.required),
    date: new FormControl<string>('', Validators.required),
    notes: new FormControl<string>(''),
  });

  constructor(
    private sessionService: SessionService,
    public dialogRef: MatDialogRef<IncomeDialog>,
    @Inject(MAT_DIALOG_DATA) public data: IncomeDialogData,
  ) {}

  ngOnInit(): void {
    if (this.data.formData) {
      const formData = this.data.formData;
      this.incomeForm.setValue({
        id: formData.id,
        category: formData.category,
        amount: formData.amount,
        date: formData.date,
        notes: formData.notes,
      });
    }
  }

  submit() {
    this.incomeForm.value.date = moment(this.incomeForm.value.date).format(
      'YYYY-MM-DD',
    );
    const formVals = this.incomeForm.value;
    const payload: IncomeRequest = {
      id: formVals.id!,
      category: formVals.category!,
      amount: Number(formVals.amount!),
      date: formVals.date!,
      notes: formVals.notes!,
    };
    this.sessionService.updateIncome(payload);
    this.message.subscribe((msg: SessionEventMessage) => {
      if (msg === SessionEventMessage.SESSION_TRANSACTION_UPDATE_SUCCESS) {
        this.dialogRef.close({ refresh: true });
      }
    });
  }

  cancel() {
    this.dialogRef.close({ refresh: false, data: null });
  }
}
