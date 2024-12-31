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
} from '@angular/material/dialog';
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
  ],
})
export class AccountEditComponent implements OnInit {
  private readonly dialogRef = inject(MatDialogRef<AccountEditComponent>);
  private readonly store = inject(FinanceStore);
  protected readonly ACCOUNT_TYPES = this.store.accountTypes();
  data = inject<AccountEditDialogData>(MAT_DIALOG_DATA);

  creditAccountForm: FormGroup;
  accountProviders: string[] = [];
  accountTypeControl = new FormControl<string | null>(null, [
    Validators.required,
  ]);

  ngOnInit() {
    this.prepareAccountProviders(this.data.account?.account_type ?? '');
    this.creditAccountForm = this.getCreditAccountForm(this.data.account);
    this.accountTypeControl.valueChanges.subscribe((value) => {
      this.prepareAccountProviders(value ?? '');
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

  private prepareAccountProviders(accountType: string) {
    this.accountProviders = this.store
      .accountProviders()
      .filter((x) => x.provider_type === accountType)
      .map((x) => x.value);
  }

  async submit() {
    const payload: CreditAccountRequest = this.creditAccountForm.value;
    const updatedAccount = await this.store.updateCreditAccount(payload);
    this.dialogRef.close(updatedAccount);
  }

  cancel() {
    this.dialogRef.close();
  }
}
