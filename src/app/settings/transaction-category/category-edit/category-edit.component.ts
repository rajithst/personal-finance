import { Component, Inject, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  CategorySettings,
  TransactionSubCategory,
} from '../../../finance/model/common';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '../../../core/api.service';
import { CategorySettingsRequest } from '../../../finance/model/category-settings';

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

  constructor(
    public dialogRef: MatDialogRef<CategoryEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CategoryEditDialogData,
  ) {}

  displayedColumns: string[] = ['name', 'description', 'actions'];
  categoryForm: FormGroup;
  subCategories: TransactionSubCategory[] =
    this.data.settings?.subCategories || [];
  dataSource = new MatTableDataSource<TransactionSubCategory>(
    this.subCategories,
  );

  ngOnInit() {
    if (this.data.task === 'edit') {
      this.categoryForm = this.getCategorySettingsForm(this.data.settings!);
    } else {
      this.categoryForm = this.getCategorySettingsForm(null);
    }
  }

  submit() {
    const categorySettingsPayload: CategorySettingsRequest = {
      category: this.categoryForm.value,
      subcategories: this.subCategories,
    };
    this.apiService.updateCategory(this.categoryForm.value).subscribe();
  }

  deleteCategory() {}

  deleteSubCategory(subCategory: TransactionSubCategory) {}
  editSubCategory(subCategory: TransactionSubCategory) {}

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
}
