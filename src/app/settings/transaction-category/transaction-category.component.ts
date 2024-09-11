import { Component, inject, OnInit } from '@angular/core';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import {
  CategorySettings,
  TransactionCategory,
  TransactionSubCategory,
} from '../../finance/model/common';
import { DataService } from '../../finance/service/data.service';
import { SUCCESS_ACTION } from '../../data/client.data';
import { CategoryEditComponent } from './category-edit/category-edit.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-transaction-category',
  templateUrl: './transaction-category.component.html',
  styleUrl: './transaction-category.component.css',
})
export class TransactionCategoryComponent implements OnInit {
  protected readonly faPencil = faPencil;

  private dataService = inject(DataService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  allCategories: TransactionCategory[] = this.dataService.getAllCategories();
  allSubCategories: TransactionSubCategory[] =
    this.dataService.getAllSubCategories();
  categorySettings: CategorySettings[] = [];
  displayedColumns: string[] = ['name', 'description'];

  ngOnInit() {
    this.allCategories.forEach((category) => {
      const subs = this.allSubCategories.filter(
        (sub) => category.id === sub.category,
      );
      this.categorySettings.push({ category: category, subCategories: subs });
    });
  }

  editCategory(settings: CategorySettings) {
    const dialog = this.dialog.open(CategoryEditComponent, {
      data: { settings, task: 'edit' },
    });
    dialog.afterClosed().subscribe((result: any) => {
      if (result.action === SUCCESS_ACTION) {
        this.snackBar.open('Updated!.', 'Success', {
          duration: 3000,
        });
      }
    });
  }
}
