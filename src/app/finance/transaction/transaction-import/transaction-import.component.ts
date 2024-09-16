import { Component, inject } from '@angular/core';
import { ApiService } from '../../../core/api.service';
import { FormControl, FormGroup } from '@angular/forms';
import { DataService } from '../../../service/data.service';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { throwError } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';
import { CANCEL_ACTION, SUCCESS_ACTION } from '../../../data/client.data';
import moment from 'moment';

@Component({
  selector: 'app-transaction-import',
  templateUrl: './transaction-import.component.html',
  styleUrl: './transaction-import.component.css',
})
export class TransactionImportComponent {
  apiService = inject(ApiService);
  dataService = inject(DataService);
  status: 'initial' | 'uploading' | 'success' | 'fail' = 'initial';
  files: Array<File> = [];
  myAccounts = this.dataService.getAccounts();
  accountForm = new FormGroup({
    account: new FormControl<number | null>(null),
  });
  secondFormGroup = new FormGroup({
    file: new FormControl(null),
  });
  readonly rangeForm = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  otherInfoForm = new FormGroup({
    drop_duplicates: new FormControl(true),
    from_last_import_date: new FormControl(false),
  });
  protected readonly faTrash = faTrash;

  constructor(public dialogRef: MatDialogRef<TransactionImportComponent>) {}

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
    const accountId = this.accountForm.get('account')?.value;
    const dropDuplicates = this.otherInfoForm.get('drop_duplicates')?.value;
    const lastDate = this.otherInfoForm.get('from_last_import_date')?.value;
    const dt1 = this.rangeForm.get('start')?.value;
    const dt2 = this.rangeForm.get('end')?.value;
    let importStartDate = '';
    let importEndDate = '';
    if (dt1) {
      importStartDate = moment(dt1).format('YYYY-MM-DD').toString();
    }
    if (dt2) {
      importEndDate = moment(dt2).format('YYYY-MM-DD').toString();
    }

    formData.append('account_id', accountId!.toString());
    formData.append('drop_duplicates', dropDuplicates === true ? '1' : '0');
    formData.append('import_from_last_date', lastDate === true ? '1' : '0');
    formData.append('start_date', importStartDate);
    formData.append('end_date', importEndDate);
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

  getLastImportDate() {
    const selectedAccount = this.accountForm.get('account')?.value;
    return this.myAccounts.find((x) => x.id === selectedAccount)
      ?.last_import_date;
  }

  isValidToSubmit() {
    return this.accountForm.invalid || this.files.length == 0;
  }

  cancel() {
    this.dialogRef.close({
      refresh: false,
      data: null,
      action: CANCEL_ACTION,
    });
  }
}
