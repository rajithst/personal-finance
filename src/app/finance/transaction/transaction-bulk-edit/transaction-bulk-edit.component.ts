import { Component, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { BulkDeleteRequest, TransactionExpand } from '../../model/transactions';
import { ApiService } from '../../../core/api.service';
import { MatButton } from '@angular/material/button';
import { NgIf } from '@angular/common';

export interface TransactionBulkEditData {
  formData: TransactionExpand[];
  task: string;
}

@Component({
    selector: 'app-transaction-bulk-edit',
    templateUrl: './transaction-bulk-edit.component.html',
    styleUrl: './transaction-bulk-edit.component.scss',
    imports: [
        MatDialogTitle,
        MatDialogContent,
        NgIf,
        MatDialogActions,
        MatButton,
        MatDialogClose,
    ]
})
export class TransactionBulkEditComponent {
  private readonly apiService = inject(ApiService);
  private readonly dialogRef = inject(
    MatDialogRef<TransactionBulkEditComponent>,
  );
  data = inject<TransactionBulkEditData>(MAT_DIALOG_DATA);

  cancel() {
    this.dialogRef.close();
  }

  async submit() {
    if (this.data.task === 'delete') {
      const payload: BulkDeleteRequest = {
        task: 'delete',
        delete_ids: this.data.formData.map((x) => x.id!),
      };
      const response = await this.apiService.bulkDeleteTransactions(payload);
      this.dialogRef.close(response ?? null);
    } else {
      this.dialogRef.close(null);
    }
  }
}
