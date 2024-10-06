import { Component, Inject, inject, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { TransactionSubCategory } from '../../../model/common';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { ApiService } from '../../../core/api.service';
import {
  CategorySettings,
  CategorySettingsRequest,
} from '../../../model/category-settings';
import {
  ERROR_ACTION,
  SUCCESS_ACTION,
  TRANSACTION_TYPES,
} from '../../../data/client.data';

interface CategoryEditDialogData {
  settings: CategorySettings | null;
  task: string;
}

@Component({
  selector: 'app-category-edit',
  templateUrl: './category-edit.component.html',
  styleUrl: './category-edit.component.css',
})
export class CategoryEditComponent implements OnInit {
  displayedColumns: string[] = ['name', 'description', 'actions'];
  categoryForm: FormGroup;
  subCategoryForm: FormGroup;
  subCategories: TransactionSubCategory[] =
    this.data.settings?.subCategories || [];
  deletedSubCategories: TransactionSubCategory[] = [];
  isCategoryDeleted = false;

  protected readonly faTrash = faTrash;
  protected readonly TRANSACTION_TYPES = TRANSACTION_TYPES;

  private readonly formBuilder = inject(FormBuilder);
  private readonly dialog = inject(MatDialog);
  private readonly apiService = inject(ApiService);

  constructor(
    public dialogRef: MatDialogRef<CategoryEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CategoryEditDialogData,
  ) {}

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

  submit() {
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
    this.apiService
      .updateCategory(categorySettingsPayload)
      .subscribe((result) => {
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

  deleteCategory() {
    const confirm = this.dialog.open(ActionConfirmComponent);
    confirm.afterClosed().subscribe((result: any) => {
      if (result) {
        this.isCategoryDeleted = true;
        this.submit();
      }
    });
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
}

@Component({
  selector: 'app-action-confirm',
  templateUrl: './category-edit-action-confirm.component.html',
  styleUrl: './category-edit.component.css',
})
export class ActionConfirmComponent {
  constructor(public dialogRef: MatDialogRef<ActionConfirmComponent>) {}

  cancel() {
    this.dialogRef.close(false);
  }

  confirm() {
    this.dialogRef.close(true);
  }
}
