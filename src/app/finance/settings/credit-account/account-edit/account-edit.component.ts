import { Component, inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import {
  ACCOUNT_TYPE_BANK_ACCOUNT,
  ACCOUNT_TYPE_CREDIT_CARD,
  ACCOUNT_TYPE_INVESTMENT_ACCOUNT,
  ACCOUNT_TYPES,
  BANK_ACCOUNT_PROVIDERS,
  CREDIT_CARD_PROVIDERS,
  INVESTMENT_ACCOUNT_PROVIDERS,
} from '../../../data/client.data';
import { CreditAccount, CreditAccountRequest } from '../../../model/account';
import { MatButton } from '@angular/material/button';
import { MatInput } from '@angular/material/input';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { FinanceStore } from '../../../../core/store/finance.store';

interface AccountEditDialogData {
  account: CreditAccount | null;
  task: string;
}

@Component({
  selector: 'app-account-edit',
  templateUrl: './account-edit.component.html',
  styleUrl: './account-edit.component.scss',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    MatInput,
    MatDialogActions,
    MatButton,
    MatDialogClose,
  ],
})
export class AccountEditComponent implements OnInit {
  private readonly dialogRef = inject(MatDialogRef<AccountEditComponent>);
  private readonly store = inject(FinanceStore);
  protected readonly ACCOUNT_TYPES = ACCOUNT_TYPES;
  data = inject<AccountEditDialogData>(MAT_DIALOG_DATA);

  creditAccountForm: FormGroup;

  accountProviders: string[] = [];
  accountTypeControl = new FormControl<string | null>(null, [
    Validators.required,
  ]);

  ngOnInit() {
    this.creditAccountForm = this.getCreditAccountForm(this.data.account);
    this.accountTypeControl.valueChanges.subscribe((value) => {
      if (value === ACCOUNT_TYPE_CREDIT_CARD) {
        this.accountProviders = CREDIT_CARD_PROVIDERS;
      } else if (value === ACCOUNT_TYPE_BANK_ACCOUNT) {
        this.accountProviders = BANK_ACCOUNT_PROVIDERS;
      } else if (value === ACCOUNT_TYPE_INVESTMENT_ACCOUNT) {
        this.accountProviders = INVESTMENT_ACCOUNT_PROVIDERS;
      }
    });
  }

  private getCreditAccountForm(account: CreditAccount | null) {
    this.accountTypeControl.setValue(account?.account_type ?? '', {
      emitEvent: true,
    });
    return new FormGroup({
      id: new FormControl<number | null>(account ? account.id : null),
      account_type: this.accountTypeControl,
      account_name: new FormControl<string | null>(
        account ? account.account_name : null,
        [Validators.required],
      ),
      description: new FormControl<string | null>(
        account ? account.description : '',
      ),
      last_import_date: new FormControl<string | null>(
        account ? account.last_import_date : null,
      ),
      provider: new FormControl<string>(account ? account.provider : '', [
        Validators.required,
      ]),
    });
  }

  async submit() {
    const payload: CreditAccountRequest = this.creditAccountForm.value;
    const updatedAccount = await this.store.updateCreditAccount(payload);
    this.dialogRef.close(updatedAccount);
  }
}
