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
import {
  CANCEL_ACTION,
  ERROR_ACTION,
  NA_CATEGORY_ID,
  SUCCESS_ACTION,
} from '../../../shared/data/client.data';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { ApiService } from '../../../core/api.service';
import { map, Observable, startWith } from 'rxjs';
import { DestinationMap } from '../../model/payee';
import { DataService } from '../../../service/data.service';
import { TransactionCategory } from '../../model/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
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
import {MatButton, MatMiniFabButton} from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { NgIf, AsyncPipe, DecimalPipe, DatePipe } from '@angular/common';
import { CdkScrollable } from '@angular/cdk/scrolling';
import {MatIcon} from "@angular/material/icon";

export interface TransactionSplitData {
  formData: TransactionExpand;
}

@Component({
  selector: 'app-transaction-split',
  templateUrl: './transaction-split.component.html',
  styleUrl: './transaction-split.component.scss',
  standalone: true,
  imports: [
    MatDialogTitle,
    CdkScrollable,
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
    FaIconComponent,
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
  private readonly dataService = inject(DataService);
  private readonly dialogRef = inject(MatDialogRef<TransactionSplitComponent>);
  data = inject<TransactionSplitData>(MAT_DIALOG_DATA);

  splitForm: FormGroup;
  filteredPayees: Observable<DestinationMap[]>[] = [];
  payees: DestinationMap[];
  transaction = this.data.formData;
  disableCategorySelect = true;
  transactionAmount = signal<number>(this.transaction.amount ?? 0);
  splitTotal = signal<number>(0);
  remainAmount = computed(() => {
    return this.transactionAmount() - this.splitTotal();
  });
  protected readonly faTrash = faTrash;
  TRANSACTION_CATEGORIES: TransactionCategory[] =
    this.dataService.getClientSettings().transaction_categories;

  get splits(): FormControl[] {
    return (this.splitForm.get('splits') as FormArray)
      .controls as FormControl[];
  }

  ngOnInit(): void {
    this.apiService.getPayees().subscribe((result) => {
      this.payees = result.payees;
      this.filterPayeeControlValues(0);
    });
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
    this.dialogRef.close({ refresh: false, data: null, action: CANCEL_ACTION });
  }

  submit() {
    const splitItems: TransactionSplit[] = this.splitForm.get('splits')?.value;
    if (splitItems) {
      const splitPayload: TransactionSplitRequest = {
        task: 'split',
        main: this.transaction,
        splits: splitItems,
      };
      this.apiService.splitTransaction(splitPayload).subscribe((result) => {
        if (result.status === 200 && result.data) {
          const responseData = result.data;
          this.dialogRef.close({
            refresh: true,
            data: responseData,
            action: SUCCESS_ACTION,
          });
        } else {
          this.dialogRef.close({
            refresh: false,
            data: null,
            alert: ERROR_ACTION,
          });
        }
      });
    }
  }

  private getNewFormArray() {
    return new FormGroup({
      destination: new FormControl<number | null>(null, [Validators.required]),
      category: new FormControl<number>(NA_CATEGORY_ID, [Validators.required]),
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
    return NA_CATEGORY_ID;
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

  private _filter(value: string): DestinationMap[] {
    const filterValue = value.toLowerCase();

    return this.payees.filter(
      (option) =>
        option.destination !== null &&
        option.destination.toLowerCase().includes(filterValue),
    );
  }
}
