import { Component, computed, inject, OnInit, signal } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import {
  TransactionExpand,
  TransactionSplit,
  TransactionSplitRequest,
} from '../../model/transactions';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ApiService } from '../../../core/api.service';
import { map, Observable, startWith } from 'rxjs';
import { Payee } from '../../model/payee';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import {
  MatAutocompleteTrigger,
  MatAutocomplete,
} from '@angular/material/autocomplete';
import { MatInput } from '@angular/material/input';
import {
  MatFormField,
  MatLabel,
  MatPrefix,
} from '@angular/material/form-field';
import { MatButton, MatMiniFabButton } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { NgIf, AsyncPipe, DecimalPipe, DatePipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { FinanceStore } from '../../../core/store/finance.store';

export interface TransactionSplitData {
  formData: TransactionExpand;
}

@Component({
  selector: 'app-transaction-split',
  templateUrl: './transaction-split.component.html',
  styleUrl: './transaction-split.component.scss',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    ReactiveFormsModule,
    NgIf,
    MatDivider,
    MatButton,
    MatFormField,
    MatLabel,
    MatInput,
    MatAutocompleteTrigger,
    MatAutocomplete,
    MatOption,
    MatSelect,
    MatPrefix,
    MatDialogActions,
    MatDialogClose,
    AsyncPipe,
    DecimalPipe,
    DatePipe,
    MatIcon,
    MatMiniFabButton,
  ],
})
export class TransactionSplitComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly apiService = inject(ApiService);
  private readonly dialogRef = inject(MatDialogRef<TransactionSplitComponent>);
  private readonly store = inject(FinanceStore);
  data = inject<TransactionSplitData>(MAT_DIALOG_DATA);

  splitForm: FormGroup;
  filteredPayees: Observable<Payee[]>[] = [];
  payees: Payee[];
  transaction = this.data.formData;
  transactionCategories = this.store.transactionSubCategories();
  transactionAmount = signal<number>(this.transaction.amount ?? 0);
  splitTotal = signal<number>(0);
  remainAmount = computed(() => {
    return this.transactionAmount() - this.splitTotal();
  });

  get splits(): FormControl[] {
    return (this.splitForm.get('splits') as FormArray)
      .controls as FormControl[];
  }

  ngOnInit(): void {
    this.splitForm = this.formBuilder.group({
      splits: this.formBuilder.array([this.getNewFormArray()]),
    });

    this.splitForm.valueChanges.subscribe((value) => {
      if (value) {
        this.splitTotal.set(0);
        this.refillCategoryForPayee();
      }
    });
  }

  onAddSplit() {
    const controls = <FormArray>this.splitForm.controls['splits'];
    controls.push(this.getNewFormArray(), { emitEvent: false });
    this.filterPayeeControlValues(controls.length - 1);
  }

  removeSplit(formIndex: number) {
    const controls = <FormArray>this.splitForm.controls['splits'];
    controls.removeAt(formIndex);
    this.filteredPayees.splice(formIndex, 1);
  }

  cancel() {
    this.dialogRef.close();
  }

  async submit() {
    const splitItems: TransactionSplit[] = this.splitForm.get('splits')?.value;
    if (splitItems) {
      const splitPayload: TransactionSplitRequest = {
        task: 'split',
        main: this.transaction,
        splits: splitItems,
      };
      const updatedTransaction =
        await this.apiService.splitTransaction(splitPayload);
      this.dialogRef.close(updatedTransaction ?? null);
    }
  }

  private getNewFormArray() {
    return new FormGroup({
      destination: new FormControl<number | null>(null, [Validators.required]),
      category: new FormControl<number>(0, [Validators.required]),
      amount: new FormControl<number | null>(null, [Validators.required]),
    });
  }

  private refillCategoryForPayee() {
    const formArray = <FormArray>this.splitForm.controls['splits'];
    formArray.controls.forEach((x) => {
      x.patchValue(
        { category: this.getCategoryForPayee(x.get('destination')?.value) },
        { emitEvent: false },
      );
      const splitAmount: number = Number(x.get('amount')?.value || 0);
      if (splitAmount) {
        this.splitTotal.update((y) => y + splitAmount);
      }
    });
  }

  private getCategoryForPayee(payee: string) {
    const targetPayee = this.payees.find((x) => x.destination === payee);
    if (targetPayee) {
      return targetPayee.category;
    }
    return 0;
  }

  private filterPayeeControlValues(formIndex: number) {
    const arrayControl = this.splitForm.get('splits') as FormArray;
    this.filteredPayees[formIndex] = arrayControl
      .at(formIndex)
      .get('destination')!
      .valueChanges.pipe(
        startWith(''),
        map((value) => this._filter(value) || ''),
      );
  }

  private _filter(value: string): Payee[] {
    const filterValue = value.toLowerCase();

    return this.payees.filter(
      (option) =>
        option.destination !== null &&
        option.destination.toLowerCase().includes(filterValue),
    );
  }
}
