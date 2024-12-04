import { Component, inject } from '@angular/core';
import { ApiService } from '../../../core/api.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DataService } from '../../../service/data.service';
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
  CANCEL_ACTION,
} from '../../../shared/data/client.data';
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
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';
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
import { CdkScrollable } from '@angular/cdk/scrolling';
import { HttpEventType } from '@angular/common/http';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatList, MatListItem, MatListItemIcon } from '@angular/material/list';
import { CreditAccount } from '../../model/account';

@Component({
  selector: 'app-transaction-import',
  templateUrl: './transaction-import.component.html',
  styleUrl: './transaction-import.component.scss',
  standalone: true,
  imports: [
    MatDialogTitle,
    CdkScrollable,
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
    FaIconComponent,
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
    MatProgressBar,
    MatCard,
    MatCardContent,
    MatIconButton,
    MatList,
    MatListItem,
    MatListItemIcon,
  ],
  providers: [provideNativeDateAdapter()],
})
export class TransactionImportComponent {
  private readonly apiService = inject(ApiService);
  private readonly dataService = inject(DataService);
  private readonly dialogRef = inject(MatDialogRef<TransactionImportComponent>);

  creditAccountTypes = [ACCOUNT_TYPE_CREDIT_CARD, ACCOUNT_TYPE_BANK_ACCOUNT];
  progress = 0;
  clickSubmit = false;
  uploadComplete = false;
  files: Array<File> = [];
  myAccounts = this.dataService
    .getAccounts()
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

  get importFirstDate() {
    return `${moment(this.rangeForm.get('start')?.value).format('YYYY-MM-DD').toString()}`
  }
  get importLastDate() {
     return `${moment(this.rangeForm.get('end')?.value).format('YYYY-MM-DD').toString()}`;
  }

  get dropDuplicates() {
    return this.otherInfoForm.get('drop_duplicates')?.value
  }

  get importFromLastDate() {
    return this.otherInfoForm.get('from_last_import_date')?.value
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
    const dt1 = this.importFirstDate;
    const dt2 = this.importLastDate;
    let importStartDate = dt1 ?? '';
    let importEndDate = dt2 ?? '';

    formData.append('account_id', accountId!.toString());
    formData.append('drop_duplicates', dropDuplicates === true ? '1' : '0');
    formData.append('import_from_last_date', lastDate === true ? '1' : '0');
    formData.append('start_date', importStartDate);
    formData.append('end_date', importEndDate);
    const upload$ = this.apiService.uploadTransactions(formData);
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
    this.dialogRef.close({
      refresh: false,
      data: null,
      action: CANCEL_ACTION,
    });
  }
}
