import {Component, inject} from '@angular/core';
import {DatePipe} from "@angular/common";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatCheckbox} from "@angular/material/checkbox";
import {MatDatepickerToggle, MatDateRangeInput, MatDateRangePicker} from "@angular/material/datepicker";
import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from "@angular/material/dialog";
import {MatStep, MatStepLabel, MatStepper, MatStepperNext, MatStepperPrevious} from "@angular/material/stepper";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatOption, MatSelect} from "@angular/material/select";
import {MatIcon} from "@angular/material/icon";
import {provideNativeDateAdapter} from "@angular/material/core";
import moment from "moment/moment";
import {SUCCESS_ACTION} from "../../../shared/data/client.data";
import {throwError} from "rxjs";
import {ApiService} from "../../../core/api.service";

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
  ],
  providers:[provideNativeDateAdapter()]
})
export class HoldingImportComponent {
  private readonly apiService = inject(ApiService);

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
  myAccounts: any[] = [];
  files: Array<File> = [];

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
    formData.append('start_date', importStartDate);
    formData.append('end_date', importEndDate);
    const upload$ = this.apiService.uploadHoldingTransactions(formData);
    upload$.subscribe({
      next: () => {
      },
      error: (error: any) => {

      },
    });
  }

  deleteAttachment(name: string) {
    this.files = this.files.filter((x) => x.name !== name);
  }


  isValidToSubmit() {
    return false;
  }


  cancel() {}
}
