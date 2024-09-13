import { Component, Inject, inject, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {
  CategorySettings,
  TransactionSubCategory,
} from '../../../finance/model/common';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { ApiService } from '../../../core/api.service';
import { CategorySettingsRequest } from '../../../finance/model/category-settings';
import {
  ERROR_ACTION,
  SUCCESS_ACTION,
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
  protected readonly faTrash = faTrash;

  apiService = inject(ApiService);
  private formBuilder = inject(FormBuilder);
  private dialog = inject(MatDialog);

  get subcategories(): FormControl[] {
    return (this.subCategoryForm.get('subcategories') as FormArray)
      .controls as FormControl[];
  }
  constructor(
    public dialogRef: MatDialogRef<CategoryEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CategoryEditDialogData,
  ) {}

  displayedColumns: string[] = ['name', 'description', 'actions'];
  categoryForm: FormGroup;
  subCategoryForm: FormGroup;
  subCategories: TransactionSubCategory[] =
    this.data.settings?.subCategories || [];
  deletedSubCategories: TransactionSubCategory[] = [];
  isCategoryDeleted = false

  ngOnInit() {
    if (this.data.task === 'edit') {
      this.categoryForm = this.getCategorySettingsForm(this.data.settings!);
      const allSubCategoryForms: FormGroup[] = [];
      this.subCategories.forEach((subCategory) => {
        allSubCategoryForms.push(this.getNewFormArray(subCategory));
      });
      this.subCategoryForm = this.formBuilder.group({
        subcategories: this.formBuilder.array(allSubCategoryForms),
      });
    } else {
      this.categoryForm = this.getCategorySettingsForm(null);
      this.subCategoryForm = this.formBuilder.group({
        subcategories: this.formBuilder.array([]),
      });
    }
  }

  submit() {
    const categorySettingsPayload: CategorySettingsRequest = {
      category: this.categoryForm.value,
      subcategories: this.subCategoryForm.get('subcategories')?.value,
      deleted_sub_categories: this.deletedSubCategories,
      delete_category: this.isCategoryDeleted
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
    const deletedItem = this.subCategories.find(x => x.id === subCategoryId);
    if (deletedItem) {
      this.deletedSubCategories.push(deletedItem)
    }
    controls.removeAt(formIndex);
  }

  private getCategorySettingsForm(settings: CategorySettings | null) {
    return new FormGroup({
      id: new FormControl(settings ? settings.category.id : null),
      category: new FormControl(settings ? settings.category.category : '', [
        Validators.required,
      ]),
      description: new FormControl(
        settings ? settings.category.description : '',
      ),
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
        [Validators.required],
      ),
      description: new FormControl<string | null>(settings.description),
    });
  }

  deleteCategory() {
    const confirm = this.dialog.open(ActionConfirmComponent)
    confirm.afterClosed().subscribe((result: any) => {
      if(result) {
        this.isCategoryDeleted = true;
        this.submit()
      }
    })
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
