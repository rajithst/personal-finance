import { Component, inject, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {TransactionExpand, TransactionSplit, TransactionSplitRequest} from '../../model/transactions';
import { FormBuilder, FormControl, FormGroup, FormArray } from '@angular/forms';
import { TRANSACTION_CATEGORIES } from '../../../data/client.data';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { ApiService } from '../../../core/api.service';
import { map, Observable, startWith } from 'rxjs';
import { DestinationMap } from '../../model/payee';

export interface TransactionSplitData {
  formData: TransactionExpand;
}

@Component({
  selector: 'app-transaction-split',
  templateUrl: './transaction-split.component.html',
  styleUrl: './transaction-split.component.css',
})
export class TransactionSplitComponent implements OnInit, OnDestroy {
  protected readonly faTrash = faTrash;

  private formBuilder = inject(FormBuilder);
  private apiService = inject(ApiService);

  TRANSACTION_CATEGORIES = TRANSACTION_CATEGORIES;
  splitForm: FormGroup;
  filteredPayees: Observable<DestinationMap[]>[] = [];
  payees: DestinationMap[];

  constructor(
    public dialogRef: MatDialogRef<TransactionSplitComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TransactionSplitData,
  ) {}

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
  }

  filterPayeeControlValues(formIndex: number) {
    const arrayControl = this.splitForm.get('splits') as FormArray;
    this.filteredPayees[formIndex] = arrayControl
      .at(formIndex)
      .get('destination')!
      .valueChanges.pipe(
        startWith(''),
        map((value) => this._filter(value) || ''),
      );
  }
  onAddSplit() {
    const controls = <FormArray>this.splitForm.controls['splits'];
    controls.push(this.getNewFormArray());
    this.filterPayeeControlValues(controls.length - 1);
  }

  removeSplit(formIndex: number) {
    const controls = <FormArray>this.splitForm.controls['splits'];
    controls.removeAt(formIndex);
    this.filteredPayees.splice(formIndex, 1);
  }

  private getNewFormArray() {
    return new FormGroup({
      destination: new FormControl(null),
      category: new FormControl(null),
      amount: new FormControl(null),
    });
  }

  private _filter(value: string): DestinationMap[] {
    const filterValue = value.toLowerCase();

    return this.payees.filter(
      (option) =>
        option.destination !== null &&
        option.destination.toLowerCase().includes(filterValue),
    );
  }

  cancel() {}

  submit() {
    const splitItems: TransactionSplit[] = this.splitForm.get('splits')?.value
    if (splitItems) {
      const splitPayload: TransactionSplitRequest = {
        task: 'split',
        main: this.data.formData,
        splits: splitItems,
      }
      this.apiService.splitTransaction(splitPayload).subscribe((result) => {
        if (result) {}
      })
    }
  }

  ngOnDestroy(): void {}
}
