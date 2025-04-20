import { Component, inject } from '@angular/core';
import { ApiService } from '../../../core/api.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { throwError } from 'rxjs';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import {
  ACCOUNT_TYPE_BANK_ACCOUNT,
  ACCOUNT_TYPE_CREDIT_CARD,
} from '../../data/client.data';
import moment from 'moment';
import { DatePipe } from '@angular/common';
import { MatCheckbox } from '@angular/material/checkbox';
import {
  MatDatepickerToggle,
  MatDateRangeInput,
  MatDateRangePicker,
  MatEndDate,
  MatStartDate,
} from '@angular/material/datepicker';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { MatOption, provideNativeDateAdapter } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import {
  MatFormField,
  MatLabel,
  MatSuffix,
} from '@angular/material/form-field';
import {
  MatStep,
  MatStepLabel,
  MatStepper,
  MatStepperNext,
  MatStepperPrevious,
} from '@angular/material/stepper';
import { HttpEventType } from '@angular/common/http';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatList, MatListItem } from '@angular/material/list';
import { CreditAccount } from '../../model/account';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { FinanceStore } from '../../../core/store/finance.store';

@Component({
  selector: 'app-transaction-import',
  templateUrl: './transaction-import.component.html',
  styleUrl: './transaction-import.component.scss',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatStepper,
    MatStep,
    ReactiveFormsModule,
    MatStepLabel,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    MatButton,
    MatStepperNext,
    MatIcon,
    MatStepperPrevious,
    MatDateRangeInput,
    MatStartDate,
    MatEndDate,
    MatDatepickerToggle,
    MatSuffix,
    MatDateRangePicker,
    MatCheckbox,
    MatDialogActions,
    MatDialogClose,
    DatePipe,
    MatCard,
    MatCardContent,
    MatList,
    MatListItem,
    MatProgressSpinner,
  ],
  providers: [provideNativeDateAdapter()],
})
export class TransactionImportComponent {
  private readonly apiService = inject(ApiService);
  private readonly dialogRef = inject(MatDialogRef<TransactionImportComponent>);
  private readonly store = inject(FinanceStore);

  creditAccountTypes = [ACCOUNT_TYPE_CREDIT_CARD, ACCOUNT_TYPE_BANK_ACCOUNT];
  progress = 0;
  clickSubmit = false;
  uploadComplete = false;
  files: Array<File> = [];
  myAccounts = this.store
    .creditAccounts()
    .filter((x) => this.creditAccountTypes.includes(x.account_type));

  accountForm = new FormGroup({
    account: new FormControl<CreditAccount | null>(null),
  });
  secondFormGroup = new FormGroup({
    file: new FormControl(null),
  });
  readonly rangeForm = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  otherInfoForm = new FormGroup({
    drop_duplicates: new FormControl<boolean>(true),
    from_last_import_date: new FormControl<boolean>(false),
  });

  get selectedAccountName() {
    return this.accountForm.get('account')?.value?.account_name ?? '';
  }

  get firstImportDate() {
    return this.rangeForm.get('start')?.value ?? '';
  }

  get lastImportDate() {
    return this.rangeForm.get('end')?.value ?? '';
  }

  get importFirstDate() {
    return this.firstImportDate
      ? `${moment(this.firstImportDate).format('YYYY-MM-DD').toString()}`
      : '';
  }
  get importLastDate() {
    return this.lastImportDate
      ? `${moment(this.lastImportDate).format('YYYY-MM-DD').toString()}`
      : '';
  }

  get dropDuplicates() {
    return this.otherInfoForm.get('drop_duplicates')?.value;
  }

  get importFromLastDate() {
    return this.otherInfoForm.get('from_last_import_date')?.value;
  }

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
    this.clickSubmit = true;
    const formData = new FormData();
    this.files.forEach((x) => {
      formData.append('files', x);
    });
    const accountId = this.accountForm.get('account')?.value?.id;
    const dropDuplicates = this.dropDuplicates;
    const lastDate = this.importFromLastDate;
    let importStartDate = this.importFirstDate ?? '';
    let importEndDate = this.importLastDate ?? '';

    formData.append('account_id', accountId!.toString());
    formData.append('drop_duplicates', dropDuplicates === true ? '1' : '0');
    formData.append('import_from_last_date', lastDate === true ? '1' : '0');
    formData.append('start_date', importStartDate);
    formData.append('end_date', importEndDate);
    const upload$ = this.apiService.uploadTransactions(formData);

    setTimeout(() => {
      this.clickSubmit = true;
      upload$.subscribe({
        next: (event) => {
          switch (event.type) {
            case HttpEventType.UploadProgress:
              if (event.total) {
                this.progress = Math.round((event.loaded / event.total) * 100);
              }
              break;
            case HttpEventType.Response:
              this.progress = 100;
              this.uploadComplete = true;
          }
        },
        error: (error: any) => {
          return throwError(() => error);
        },
      });
    }, 2000);
  }

  deleteAttachment(name: string) {
    this.files = this.files.filter((x) => x.name !== name);
  }

  getLastImportDate() {
    const selectedAccount =
      this.accountForm.get('account')?.value?.account_type ?? -1;
    return this.myAccounts.find((x) => x.id === selectedAccount)
      ?.last_import_date;
  }

  isValidToSubmit() {
    return !this.accountForm.invalid && this.files.length > 0;
  }

  cancel() {
    this.dialogRef.close();
  }

  close() {
    this.dialogRef.close(this.progress === 100 && this.uploadComplete);
  }
}
