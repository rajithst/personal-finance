import {Component, inject, Inject, OnInit} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  ACCOUNT_PROVIDER_DOCOMO_CARD,
  ACCOUNT_PROVIDER_EPOS_CARD,
  ACCOUNT_PROVIDER_MIZUHO,
  ACCOUNT_PROVIDER_RAKUTEN,
  CREDIT_ACCOUNT_TYPE_BANK_ACCOUNT,
  CREDIT_ACCOUNT_TYPE_CREDIT_CARD, ERROR_ACTION, SUCCESS_ACTION,
} from '../../../data/client.data';
import {CreditAccount, CreditAccountRequest} from "../../../model/account";
import {ApiService} from "../../../core/api.service";

interface AccountEditDialogData {
  account: CreditAccount | null;
  task: string;
}

@Component({
  selector: 'app-account-edit',
  templateUrl: './account-edit.component.html',
  styleUrl: './account-edit.component.css',
})
export class AccountEditComponent implements OnInit {
  private readonly apiService = inject(ApiService);

  creditAccountForm: FormGroup;
  ACCOUNT_TYPES = [
    CREDIT_ACCOUNT_TYPE_CREDIT_CARD,
    CREDIT_ACCOUNT_TYPE_BANK_ACCOUNT,
  ];
  ACCOUNT_PROVIDERS = [
    ACCOUNT_PROVIDER_RAKUTEN,
    ACCOUNT_PROVIDER_MIZUHO,
    ACCOUNT_PROVIDER_EPOS_CARD,
    ACCOUNT_PROVIDER_DOCOMO_CARD,
  ];
  constructor(
    public dialogRef: MatDialogRef<AccountEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AccountEditDialogData,
  ) {}

  ngOnInit() {
    this.creditAccountForm = this.getCreditAccountForm(this.data.account);
  }

  private getCreditAccountForm(account: CreditAccount | null) {
    return new FormGroup({
      id: new FormControl<number | null>(account ? account.id : null),
      account_type: new FormControl<string>(
        account ? account.account_type : '',
        [Validators.required],
      ),
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

  submit() {
    const payload: CreditAccountRequest = this.creditAccountForm.value;
    this.apiService.updateCreditAccount(payload).subscribe((result) => {
      if (result) {
        this.dialogRef.close({
          refresh: true,
          data: result,
          action: SUCCESS_ACTION,
        });
      } else {
        this.dialogRef.close({
          refresh: false,
          data: null,
          action: ERROR_ACTION,
        });
      }
    });
  }
}
