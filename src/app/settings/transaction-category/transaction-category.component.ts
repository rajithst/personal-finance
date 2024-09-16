import { Component, inject, OnInit } from '@angular/core';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import {
  TransactionCategory,
  TransactionSubCategory,
} from '../../model/common';
import { DataService } from '../../service/data.service';
import { SUCCESS_ACTION } from '../../data/client.data';
import { CategoryEditComponent } from './category-edit/category-edit.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CategorySettings } from '../../model/category-settings';

@Component({
  selector: 'app-transaction-category',
  templateUrl: './transaction-category.component.html',
  styleUrl: './transaction-category.component.css',
})
export class TransactionCategoryComponent implements OnInit {
  categorySettings: CategorySettings[] = [];
  displayedColumns: string[] = ['name', 'description'];
  protected readonly faPencil = faPencil;
  private dataService = inject(DataService);
  allCategories: TransactionCategory[] = this.dataService.getAllCategories();
  allSubCategories: TransactionSubCategory[] =
    this.dataService.getAllSubCategories();
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

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
        const targetId = this.categorySettings.findIndex(
          (x) => x.category.id === settings.category.id,
        );
        if (targetId !== -1) {
          if (!result.data.category && result.data.subcategories.length === 0) {
            this.categorySettings.splice(targetId, 1);
          } else {
            this.categorySettings[targetId] = {
              category: result.data.category,
              subCategories: result.data.subcategories,
            };
          }
          this.refreshClientSettings();
          this.snackBar.open('Updated!.', 'Success', {
            duration: 3000,
          });
        }
      }
    });
  }

  addCategory() {
    const dialog = this.dialog.open(CategoryEditComponent, {
      data: { settings: null, task: 'add' },
    });
    dialog.afterClosed().subscribe((result: any) => {
      if (result.action === SUCCESS_ACTION) {
        this.categorySettings.push({
          category: result.data.category,
          subCategories: result.data.subcategories,
        });
        this.snackBar.open('Added!.', 'Success', {
          duration: 3000,
        });
      }
    });
  }

  private refreshClientSettings() {
    const clientSettings = this.dataService.getClientSettings();
    clientSettings.transaction_categories = this.categorySettings.map(
      (x) => x.category,
    );
    clientSettings.transaction_sub_categories = this.categorySettings
      .map((x) => x.subCategories)
      .flat();
    this.dataService.setClientSettings(clientSettings);
  }
}
