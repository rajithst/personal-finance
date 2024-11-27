import { Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import {
  MatDatepickerToggle,
  MatDateRangeInput,
  MatDateRangePicker, MatEndDate, MatStartDate,
} from '@angular/material/datepicker';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import {
  MatStep,
  MatStepLabel,
  MatStepper,
  MatStepperNext,
  MatStepperPrevious,
} from '@angular/material/stepper';
import {MatFormField, MatLabel, MatSuffix} from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatIcon } from '@angular/material/icon';
import { provideNativeDateAdapter } from '@angular/material/core';
import moment from 'moment/moment';
import { ApiService } from '../../../core/api.service';
import { DataService } from '../../../service/data.service';
import { ACCOUNT_TYPE_INVESTMENT_ACCOUNT } from '../../../shared/data/client.data';
import {MatRadioButton, MatRadioGroup} from "@angular/material/radio";
import {MatCard, MatCardContent} from "@angular/material/card";
import {MatProgressBar} from "@angular/material/progress-bar";
import {HttpEventType} from "@angular/common/http";
import {throwError} from "rxjs";
import {CreditAccount} from "../../../finance/model/account";

@Component({
  selector: 'app-holding-import',
  templateUrl: './holding-import.component.html',
  styleUrl: './holding-import.component.scss',
  standalone: true,
  imports: [
    DatePipe,
    FaIconComponent,
    FormsModule,
    MatButton,
    MatCheckbox,
    MatDateRangeInput,
    MatDialogContent,
    MatStepper,
    MatStep,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatIcon,
    MatStartDate,
    MatEndDate,
    MatSelect,
    MatStepperPrevious,
    MatStepperNext,
    MatStepLabel,
    MatDatepickerToggle,
    MatDateRangePicker,
    MatDialogActions,
    MatDialogClose,
    MatOption,
    MatDialogTitle,
    MatSuffix,
    MatRadioGroup,
    MatRadioButton,
    MatCard,
    MatCardContent,
    MatProgressBar,
  ],
  providers: [provideNativeDateAdapter()],
})
export class HoldingImportComponent {
  private readonly apiService = inject(ApiService);
  private readonly dataService = inject(DataService);

  myAccounts: any[] = this.dataService
    .getAccounts()
    .filter((x) => x.account_type === ACCOUNT_TYPE_INVESTMENT_ACCOUNT);
  progress = 0;
  clickSubmit = false;
  uploadComplete = false;
  files: Array<File> = [];

  accountForm = new FormGroup({
    account: new FormControl<CreditAccount | null>(null),
  });
  secondFormGroup = new FormGroup({
    target: new FormControl<string | null>(null),
    file: new FormControl(null),
  });
  readonly rangeForm = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  get selectedAccountName() {
    return this.accountForm.get('account')?.value?.account_name ?? '';
  }
  get selectedTargetName() {
    return this.secondFormGroup.get('target')?.value ?? '';
  }
  get importFirstDate() {
    return `${moment(this.rangeForm.get('start')?.value).format('YYYY-MM-DD').toString()}`
  }
  get importLastDate() {
    return `${moment(this.rangeForm.get('end')?.value).format('YYYY-MM-DD').toString()}`;
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
    const formData = new FormData();
    this.files.forEach((x) => {
      formData.append('files', x);
    });
    const accountId = this.accountForm.get('account')?.value?.id.toString() ?? '';
    const importStartDate = this.importFirstDate ?? '';
    const importEndDate = this.importLastDate ?? '';
    const target = this.secondFormGroup.get('target')?.value ?? '';
    formData.append('account_id', accountId);
    formData.append('start_date', importStartDate);
    formData.append('end_date', importEndDate);
    formData.append('target', target);
    const upload$ = this.apiService.uploadHoldingTransactions(formData);
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

  isValidToSubmit() {
    return !this.accountForm.invalid && this.files.length > 0;
  }

  cancel() {}
}
