import { Component, inject, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
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
import { TransactionSubCategory } from '../../../model/common';
import {
  CategorySettings,
  CategorySettingsRequest,
} from '../../../model/category-settings';
import { TRANSACTION_TYPES } from '../../../data/client.data';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatInput } from '@angular/material/input';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { FinanceStore } from '../../../../core/store/finance.store';
import { MatIcon } from '@angular/material/icon';

interface CategoryEditDialogData {
  settings: CategorySettings | null;
  task: string;
}

@Component({
  selector: 'app-category-edit',
  templateUrl: './category-edit.component.html',
  styleUrl: './category-edit.component.scss',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    MatInput,
    MatDivider,
    MatButton,
    MatDialogActions,
    MatIcon,
    MatIconButton,
  ],
})
export class CategoryEditComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<CategoryEditComponent>);
  private readonly store = inject(FinanceStore);
  data = inject<CategoryEditDialogData>(MAT_DIALOG_DATA);

  displayedColumns: string[] = ['name', 'description', 'actions'];
  categoryForm: FormGroup;
  subCategoryForm: FormGroup;
  subCategories: TransactionSubCategory[] =
    this.data.settings?.subCategories || [];
  deletedSubCategories: TransactionSubCategory[] = [];
  isCategoryDeleted = false;

  protected readonly TRANSACTION_TYPES = TRANSACTION_TYPES;

  get subcategories(): FormControl[] {
    return (this.subCategoryForm.get('subcategories') as FormArray)
      .controls as FormControl[];
  }

  ngOnInit() {
    if (this.data.task === 'edit') {
      this.categoryForm = this.getCategorySettingsForm(this.data.settings);
      const allSubCategoryForms: FormGroup[] = [];
      this.subCategories.forEach((subCategory) => {
        allSubCategoryForms.push(this.getNewFormArray(subCategory));
      });
      this.subCategoryForm = this.formBuilder.group({
        subcategories: this.formBuilder.array(allSubCategoryForms),
      });
    } else if (this.data.task === 'add') {
      this.categoryForm = this.getCategorySettingsForm(null);
      this.subCategoryForm = this.formBuilder.group({
        subcategories: this.formBuilder.array([]),
      });
    }
  }

  async submit() {
    const allSubcategoryForms = this.subcategories;
    const touchedFormValues: TransactionSubCategory[] = [];
    allSubcategoryForms.forEach((x) => {
      if (x.touched) {
        touchedFormValues.push(x.value);
      }
    });
    const categorySettingsPayload: CategorySettingsRequest = {
      category: this.categoryForm.value,
      subcategories: touchedFormValues,
      deleted_sub_categories: this.deletedSubCategories,
      delete_category: this.isCategoryDeleted,
    };
    const updatedCategory = await this.store.updateCategory(
      categorySettingsPayload,
    );
    this.dialogRef.close(updatedCategory);
  }

  onAddSubCategory() {
    const controls = <FormArray>this.subCategoryForm.controls['subcategories'];
    const tempSubCategory: TransactionSubCategory = {
      id: 0,
      name: '',
      category: this.data.task === 'edit' ? this.data.settings!.category.id : 0,
      category_text: '',
      description: null,
    };
    controls.push(this.getNewFormArray(tempSubCategory), { emitEvent: false });
  }

  deleteSubCategory(formIndex: number) {
    const controls = <FormArray>this.subCategoryForm.controls['subcategories'];
    const subCategoryId = controls.at(formIndex).get('id')?.value;
    const deletedItem = this.subCategories.find((x) => x.id === subCategoryId);
    if (deletedItem) {
      this.deletedSubCategories.push(deletedItem);
    }
    controls.removeAt(formIndex);
  }

  private getCategorySettingsForm(settings: CategorySettings | null) {
    return new FormGroup({
      id: new FormControl<number | null>(
        settings ? settings.category.id : null,
      ),
      category: new FormControl<string>(
        settings ? settings.category.category : '',
        [Validators.required],
      ),
      category_type: new FormControl<number | null>(
        settings ? settings.category.category_type : null,
        [Validators.required],
      ),
      description: new FormControl<string | null>(
        settings ? settings.category.description : '',
      ),
      can_delete: new FormControl<boolean>(true),
      can_rename: new FormControl<boolean>(true),
    });
  }

  private getNewFormArray(settings: TransactionSubCategory) {
    return new FormGroup({
      id: new FormControl<number | null>(
        settings.id === 0 ? null : settings.id,
      ),
      name: new FormControl<string | null>(settings.name, [
        Validators.required,
      ]),
      category: new FormControl<number | null>(
        settings.category === 0 ? null : settings.category,
      ),
      description: new FormControl<string | null>(settings.description),
    });
  }

  cancel() {
    this.dialogRef.close();
  }
}
