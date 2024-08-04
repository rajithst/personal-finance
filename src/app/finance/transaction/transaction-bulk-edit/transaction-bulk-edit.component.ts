import { Component, inject, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BulkDeleteRequest, TransactionExpand } from '../../model/transactions';
import { ApiService } from '../../../core/api.service';
import {
  CANCEL_ACTION,
  ERROR_ACTION,
  SUCCESS_ACTION,
} from '../../../data/client.data';

export interface TransactionBulkEditData {
  formData: TransactionExpand[];
  task: string;
}

@Component({
  selector: 'app-transaction-bulk-edit',
  templateUrl: './transaction-bulk-edit.component.html',
  styleUrl: './transaction-bulk-edit.component.css',
})
export class TransactionBulkEditComponent {
  private apiService = inject(ApiService);
  constructor(
    public dialogRef: MatDialogRef<TransactionBulkEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TransactionBulkEditData,
  ) {}

  cancel() {
    this.dialogRef.close({ refresh: false, data: null, action: CANCEL_ACTION });
  }

  submit() {
    if (this.data.task === 'delete') {
      const payload: BulkDeleteRequest = {
        task: 'delete',
        delete_ids: this.data.formData.map((x) => x.id!),
      };
      this.apiService.bulkDeleteTransactions(payload).subscribe((result) => {
        const action = result.status === 200 ? SUCCESS_ACTION : ERROR_ACTION;
        this.dialogRef.close({
          refresh: result.status === 200,
          data: result.data,
          action: action,
        });
      });
    } else {
      this.dialogRef.close({ refresh: false, data: null, action: CANCEL_ACTION });
    }
  }
}
