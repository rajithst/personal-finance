import { Component, inject, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TransactionExpand } from '../../model/transactions';
import {
  CANCEL_ACTION,
  ERROR_ACTION,
  SUCCESS_ACTION,
} from '../../../data/client.data';
import moment from 'moment';
import { ApiService } from '../../../core/api.service';
import { Income, IncomeExpand } from '../../model/income';

export interface IncomeUpdateDialogData {
  formData: TransactionExpand;
  task: string;
}

@Component({
  selector: 'app-income-update',
  templateUrl: './income-update.component.html',
  styleUrl: './income-update.component.css',
})
export class IncomeUpdateDialog implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<IncomeUpdateDialog>,
    @Inject(MAT_DIALOG_DATA) public data: IncomeUpdateDialogData,
  ) {}

  apiService = inject(ApiService);

  incomeForm: FormGroup;
  formData: TransactionExpand;

  ngOnInit(): void {
    if (this.data.task == 'edit' || this.data.task == 'delete') {
      this.formData = this.data.formData!;
      this.incomeForm = this.getNewIncomeForm(this.formData);
    } else if (this.data.task == 'add') {
      this.incomeForm = this.getNewIncomeForm(null);
    }
  }

  getNewIncomeForm(data: TransactionExpand | null) {
    return new FormGroup({
      id: new FormControl<number | null>(data ? data.id : null),
      category: new FormControl<number | null>(data ? data.category : null, [
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
      notes: new FormControl<string | null>(data ? data.notes : null),
      is_deleted: new FormControl<boolean>(data ? data.is_deleted : false),
      delete_reason: new FormControl<string | null>(
        data ? data.delete_reason : null,
      ),
      source: new FormControl<number | null>(data ? data.source : 2),
    });
  }

  submit() {
    this.incomeForm.value.date = moment(this.incomeForm.value.date).format(
      'YYYY-MM-DD',
    );
    this.incomeForm.value.amount = Number(this.incomeForm.value.amount);
    const payload: Income = this.incomeForm.value;
    this.apiService.updateIncome(payload).subscribe((income: IncomeExpand) => {
      if (income) {
        this.dialogRef.close({
          refresh: true,
          data: income,
          action: SUCCESS_ACTION,
        });
      } else {
        this.dialogRef.close({
          refresh: false,
          data: null,
          action: ERROR_ACTION,
        });
      }
    });
  }

  cancel() {
    this.dialogRef.close({ refresh: false, data: null, action: CANCEL_ACTION });
  }
}

@Component({
  selector: 'app-income-delete',
  templateUrl: './income-delete.component.html',
  styleUrl: './income-delete.component.css',
})
export class IncomeDeleteDialog extends IncomeUpdateDialog {
  deleteReason: string = '';

  confirm() {
    this.incomeForm.get('is_deleted')?.setValue(true);
    this.incomeForm.get('delete_reason')?.setValue(this.deleteReason);
    this.submit();
  }
}
