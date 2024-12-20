import {
  Component,
  computed,
  inject,
  Inject,
  OnInit,
  signal,
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import moment from 'moment/moment';
import { CompanyInfo } from '../../model/investment';
import { ApiService } from '../../../core/api.service';
import { MatButton } from '@angular/material/button';
import {
  MatDatepickerInput,
  MatDatepickerToggle,
  MatDatepicker,
} from '@angular/material/datepicker';
import { MatInput } from '@angular/material/input';
import { MatOption, provideNativeDateAdapter } from '@angular/material/core';
import { MatSelect, MatSelectTrigger } from '@angular/material/select';
import {
  MatFormField,
  MatLabel,
  MatSuffix,
} from '@angular/material/form-field';
import { NgIf } from '@angular/common';
import { CdkScrollable } from '@angular/cdk/scrolling';

interface HoldingUpdateData {
  task: string;
}

@Component({
    selector: 'app-holding-update',
    templateUrl: './holding-update.component.html',
    styleUrl: './holding-update.component.scss',
    imports: [
        MatDialogTitle,
        CdkScrollable,
        MatDialogContent,
        ReactiveFormsModule,
        NgIf,
        MatFormField,
        MatLabel,
        MatSelect,
        MatSelectTrigger,
        MatOption,
        MatInput,
        MatDatepickerInput,
        MatDatepickerToggle,
        MatSuffix,
        MatDatepicker,
        MatDialogActions,
        MatButton,
        MatDialogClose,
    ],
    providers: [provideNativeDateAdapter()]
})
export class HoldingUpdateComponent implements OnInit {
  apiService = inject(ApiService);
  companies = signal<CompanyInfo[]>([]);
  company = signal<CompanyInfo | null>(null);
  companyName = computed(() => this.company()?.company_name);
  companyImage = computed(() => this.company()?.image);
  currency = computed(() => this.company()?.stock_currency);
  transactionForm = this.getNewTransactionForm();

  constructor(
    public dialogRef: MatDialogRef<HoldingUpdateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: HoldingUpdateData,
  ) {}

  ngOnInit(): void {
    this.apiService.getCompanies().subscribe((value) => {
      this.companies.set(value);
    });
    this.transactionForm.get('company')?.valueChanges.subscribe((value) => {
      if (value) {
        const selectedCompany = this.companies().find(
          (x) => x.symbol === value,
        );
        if (selectedCompany) {
          this.company.set(selectedCompany);
          this.transactionForm
            .get('stock_currency')
            ?.setValue(selectedCompany.stock_currency);
        }
      }
    });
  }

  cancel() {}

  submit() {
    this.transactionForm.value.purchase_date = moment(
      this.transactionForm.value.purchase_date,
    ).format('YYYY-MM-DD');
    this.transactionForm.value.quantity = Number(
      this.transactionForm.value.quantity,
    );
    this.transactionForm.value.purchase_price = Number(
      this.transactionForm.value.purchase_price,
    );
    //const payload = this.transactionForm.value as StockPurchase;
    // this.apiService.updateStockPurchase(payload).subscribe((value) => {
    //   if (value) {
    //     this.dialogRef.close({ refresh: true });
    //   } else {
    //     this.dialogRef.close({ refresh: false });
    //   }
    // });
  }

  private getNewTransactionForm() {
    return new FormGroup({
      id: new FormControl<number | null>(null),
      company: new FormControl<string>('', [Validators.required]),
      purchase_date: new FormControl<string>('', [Validators.required]),
      quantity: new FormControl<number | null>(null, [Validators.required]),
      purchase_price: new FormControl<number | null>(null, [
        Validators.required,
      ]),
      settlement_currency: new FormControl<string | null>(null, [
        Validators.required,
      ]),
      exchange_rate: new FormControl<number | null>(null),
      stock_currency: new FormControl<string>(''),
      notes: new FormControl<string>(''),
    });
  }
}
