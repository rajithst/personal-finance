import { Component, inject, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BulkUpdateRequest, TransactionExpand } from '../../model/transactions';
import { ApiService } from '../../../core/api.service';

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

  cancel() {}

  submit() {
    if (this.data.task === 'delete') {
      const payload: BulkUpdateRequest = {
        task: 'delete',
        delete_ids: this.data.formData.map((x) => x.id!),
      };
      this.apiService.updateBulkTransactions(payload).subscribe((result) => {
        this.dialogRef.close({
          refresh: result.status === 200,
          data: result.data,
        });
      });
    } else {
      this.dialogRef.close({ refresh: true, data: null });
    }
  }
}
