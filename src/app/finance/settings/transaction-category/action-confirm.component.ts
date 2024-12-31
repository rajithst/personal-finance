import { Component, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { FinanceStore } from '../../../core/store/finance.store';
import { CategorySettings } from '../../model/category-settings';

interface CategoryDeleteDialogData {
  settings: CategorySettings;
}

@Component({
  selector: 'app-action-confirm',
  template: `
    <h2 mat-dialog-title>Delete Category</h2>
    <mat-dialog-content>
      <p>Do you want to delete this category?</p>
      <p>This will effect</p>
      <ul>
        <li>Associated sub categories will be deleted.</li>
        <li>Transactions associated with this category will be updated to uncategorized.</li>
      </ul>
    </mat-dialog-content>

    <mat-dialog-actions align="end" class="expense-form-footer">
      <button (click)="cancel()" mat-dialog-close mat-raised-button>
        Cancel
      </button>
      <button (click)="confirm()" color="primary" mat-raised-button>
        Delete
      </button>
    </mat-dialog-actions>
  `,
  styles: `
    mat-dialog-content {
      width: 600px;
    }
  `,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    MatDialogClose,
  ],
})
export class ActionConfirmComponent {
  private readonly store = inject(FinanceStore);
  private readonly dialogRef = inject(MatDialogRef<ActionConfirmComponent>);
  dialogData = inject<CategoryDeleteDialogData>(MAT_DIALOG_DATA);

  cancel() {
    this.dialogRef.close();
  }

  async confirm() {
    const isDeleted = await this.store.deleteCategory(
      this.dialogData.settings.category.id,
    );
    this.dialogRef.close(isDeleted);
  }
}
