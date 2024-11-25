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
import {MatButton, MatIconButton} from '@angular/material/button';
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
import {MatProgressBar} from "@angular/material/progress-bar";
import {MatCard, MatCardContent} from "@angular/material/card";

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
    drop_duplicates: new FormControl<boolean>(true),
    from_last_import_date: new FormControl<boolean>(false),
  });

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
    const selectedAccount = this.accountForm.get('account')?.value;
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
