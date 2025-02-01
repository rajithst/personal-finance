import {Component, inject, OnInit, ViewChild} from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { Payee } from '../../model/payee';
import {
  TRANSACTION_TYPE_EXPENSE_ID,
  TRANSACTION_TYPE_INCOME_ID,
  TRANSACTION_TYPE_PAYMENTS_ID,
  TRANSACTION_TYPE_SAVINGS_ID,
  TRANSACTION_TYPES,
} from '../../data/client.data';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  MatChipEditedEvent,
  MatChipInputEvent,
  MatChipGrid,
  MatChipRow,
  MatChipRemove,
  MatChipInput,
} from '@angular/material/chips';
import {
  MatTableDataSource,
  MatTable,
  MatColumnDef,
  MatHeaderCellDef,
  MatHeaderCell,
  MatCellDef,
  MatCell,
  MatNoDataRow,
  MatHeaderRowDef,
  MatHeaderRow,
  MatRowDef,
  MatRow,
} from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import {
  TransactionCategory,
  TransactionSubCategory,
} from '../../model/common';
import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatIcon } from '@angular/material/icon';
import { MatDivider } from '@angular/material/divider';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { FinanceStore } from '../../../core/store/finance.store';
import {MatPaginator} from "@angular/material/paginator";

interface PayeeEditDialogData {
  payee: Payee;
}

@Component({
  selector: 'app-payee-edit',
  templateUrl: './payee-edit.component.html',
  styleUrl: './payee-edit.component.scss',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatSelect,
    MatOption,
    MatDivider,
    MatChipGrid,
    MatChipRow,
    MatChipRemove,
    MatIcon,
    MatChipInput,
    MatTable,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCheckbox,
    MatCellDef,
    MatCell,
    MatNoDataRow,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    MatDialogActions,
    MatButton,
    MatDialogClose,
    MatPaginator,
  ],
})
export class PayeeEditComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  private readonly dialogRef = inject(MatDialogRef<PayeeEditComponent>);
  private readonly store = inject(FinanceStore);
  data = inject<PayeeEditDialogData>(MAT_DIALOG_DATA);

  readonly addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  transactionCategories: TransactionCategory[] = [];
  transactionSubCategories: TransactionSubCategory[] = [];
  payeeForm: FormGroup;
  keywords: string[] = [];
  displayedColumns: string[] = ['select', 'Payee', 'Category', 'SubCategory'];
  dataSource: MatTableDataSource<Payee>;
  selection = new SelectionModel<Payee>(true, []);
  protected readonly TRANSACTION_TYPES = TRANSACTION_TYPES;

  ngOnInit(): void {
    const payeeData = this.data.payee;
    const transactionType = payeeData.category_type;

    this.payeeForm = new FormGroup({
      id: new FormControl<number | null>(payeeData.id),
      category_type: new FormControl<number | null>(payeeData.category_type),
      category: new FormControl<number | null>(payeeData.category),
      subcategory: new FormControl<number | null>(payeeData.subcategory),
      category_text: new FormControl<string | null>(payeeData.category_text),
      subcategory_text: new FormControl<string | null>(
        payeeData.subcategory_text,
      ),
      destination: new FormControl<string | null>(payeeData.destination),
      destination_original: new FormControl<string | null>(
        payeeData.destination_original,
      ),
      destination_eng: new FormControl<string | null>(
        payeeData.destination_eng,
      ),
    });
    if (this.data.payee.keywords) {
      this.keywords = this.data.payee.keywords
        .split(',')
        .map((keyword) => keyword.trim());
    }
    this.setTransactionCategories(transactionType);
    this.setTransactionSubCategories(payeeData.category);

    this.payeeForm.get('category')?.valueChanges.subscribe((value) => {
      if (value) {
        this.setTransactionSubCategories(value);
      }
    });
    this.payeeForm.get('category_type')?.valueChanges.subscribe((value) => {
      this.payeeForm.get('subcategory')?.setValue(null);
      this.payeeForm.get('category')?.setValue(null);
      this.setTransactionCategories(value);
    });
    this.updateRelatedPayees();
  }

  updateRelatedPayees() {
    const relatedPayees = this.store.payees();
    const similarPayees = relatedPayees.filter(
      (x) =>
        x.id !== this.data.payee.id &&
        x.destination_original &&
        this.keywords.some((item) =>
          x.destination_original.toLowerCase().includes(item.toLowerCase()),
        ),
    );
    this.dataSource = new MatTableDataSource<Payee>(similarPayees);
    this.dataSource.paginator = this.paginator;
    this.selection.clear();
    this.selection.select(...this.dataSource.data);
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (this.keywords.includes(value)) {
      event.chipInput.clear();
      return;
    }
    if (value) {
      this.keywords.push(value);
    }
    event.chipInput.clear();
    this.updateRelatedPayees();
  }

  remove(keyword: string): void {
    const index = this.keywords.indexOf(keyword);
    if (index !== -1) {
      this.keywords.splice(index, 1);
    }
    this.updateRelatedPayees();
  }

  edit(keyword: string, event: MatChipEditedEvent) {
    const value = event.value.trim();
    if (!value) {
      this.remove(keyword);
      return;
    }
    const index = this.keywords.indexOf(keyword);
    if (index >= 0) {
      this.keywords[index] = value;
      return [...this.keywords];
    }
    this.updateRelatedPayees();
    return this.keywords;
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.dataSource.data);
  }

  async submit() {
    const formValues = this.payeeForm.value;
    formValues['keywords'] = this.keywords.join(',');
    formValues['merge_ids'] = this.selection.selected.map((x) => x.id);
    const updatedPayee = await this.store.updatePayee(formValues);
    this.dialogRef.close(updatedPayee);
  }

  cancel() {
    this.dialogRef.close();
  }

  private setTransactionCategories(transactionType: number) {
    if (transactionType === TRANSACTION_TYPE_EXPENSE_ID) {
      this.transactionCategories = this.store.expenseCategories();
    } else if (transactionType === TRANSACTION_TYPE_INCOME_ID) {
      this.transactionCategories = this.store.incomeCategories();
    } else if (transactionType === TRANSACTION_TYPE_SAVINGS_ID) {
      this.transactionCategories = this.store.savingsCategories();
    } else if (transactionType === TRANSACTION_TYPE_PAYMENTS_ID) {
      this.transactionCategories = [
        ...this.store.paymentCategories(),
        ...this.store.expenseCategories(),
      ];
    }
    if (this.transactionCategories.length === 1) {
      const categoryId = this.transactionCategories.at(0)!.id;
      this.payeeForm
        .get('category')
        ?.patchValue(categoryId, { emitEvent: true, onlySelf: true });
      this.setTransactionSubCategories(categoryId);
    }
  }

  private setTransactionSubCategories(category: number) {
    if (category !== null) {
      this.transactionSubCategories = this.store
        .transactionSubCategories()
        .filter((x) => x.category === category);
    }

    if (this.transactionSubCategories.length === 1) {
      this.payeeForm
        .get('subcategory')
        ?.setValue(this.transactionSubCategories.at(0)!.id);
    }
  }
}
