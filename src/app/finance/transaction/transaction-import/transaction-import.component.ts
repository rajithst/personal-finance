import { Component, inject } from '@angular/core';
import { ApiService } from '../../../core/api.service';
import { FormBuilder, FormControl } from '@angular/forms';
import { DataService } from '../../service/data.service';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { throwError } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';
import { SUCCESS_ACTION } from '../../../data/client.data';

@Component({
  selector: 'app-transaction-import',
  templateUrl: './transaction-import.component.html',
  styleUrl: './transaction-import.component.css',
})
export class TransactionImportComponent {
  apiService = inject(ApiService);
  formBuilder = inject(FormBuilder);
  dataService = inject(DataService);
  protected readonly faTrash = faTrash;

  status: 'initial' | 'uploading' | 'success' | 'fail' = 'initial';
  files: Array<File> = [];

  constructor(public dialogRef: MatDialogRef<TransactionImportComponent>) {}

  firstFormGroup = this.formBuilder.group({
    account: new FormControl<number | null>(null),
  });
  secondFormGroup = this.formBuilder.group({
    file: new FormControl(null),
  });

  myAccounts = this.dataService.getAccounts();

  onChange(event: any) {
    const uploadHook = event.target as HTMLInputElement;
    if (uploadHook.files && uploadHook.files.length > 0) {
      for (let index = 0; index < uploadHook.files.length; index++) {
        const file = uploadHook.files[index];
        this.files.push(file);
      }
    }
  }

  import() {
    const formData = new FormData();
    this.files.forEach((x) => {
      formData.append('files', x);
    });
    const accountId = this.firstFormGroup.get('account')?.value;
    formData.append('account_id', accountId!.toString());
    const upload$ = this.apiService.uploadTransactions(formData);
    upload$.subscribe({
      next: () => {
        this.dialogRef.close({
          refresh: true,
          data: null,
          action: SUCCESS_ACTION,
        });
      },
      error: (error: any) => {
        this.status = 'fail';
        return throwError(() => error);
      },
    });
  }

  deleteAttachment(name: string) {
    this.files = this.files.filter((x) => x.name !== name);
  }

  cancel() {}
}
