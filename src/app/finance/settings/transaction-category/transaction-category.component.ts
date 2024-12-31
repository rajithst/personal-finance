import { Component, inject, OnInit } from '@angular/core';
import { CategoryEditComponent } from './category-edit/category-edit.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CategorySettings } from '../../model/category-settings';
import {
  MatCell, MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef,
  MatRow, MatRowDef,
  MatTable,
} from '@angular/material/table';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelDescription,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';
import { MatButton, MatIconButton } from '@angular/material/button';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { FinanceStore } from '../../../core/store/finance.store';
import { ActionConfirmComponent } from './action-confirm.component';

const DIALOG_WIDTH = '900px';
const DIALOG_TOP_POSITION = '5%';

@Component({
  selector: 'app-transaction-category',
  templateUrl: './transaction-category.component.html',
  styleUrl: './transaction-category.component.scss',
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatButton,
    MatCardContent,
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    MatExpansionPanelDescription,
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatHeaderRow,
    MatRow,
    MatIcon,
    MatIconButton,
    MatHeaderCellDef,
    MatCellDef,
    MatHeaderRowDef,
    MatRowDef,
  ],
})
export class TransactionCategoryComponent implements OnInit {
  private readonly store = inject(FinanceStore);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  categorySettings: CategorySettings[] = [];
  displayedColumns: string[] = ['name', 'description'];

  ngOnInit() {
    this.prepareCategories();
  }

  prepareCategories() {
    const allCategories = this.store.transactionCategories();
    const allSubCategories = this.store.transactionSubCategories();
    this.categorySettings = [];
    console.log(allCategories);
    console.log(allSubCategories);
    allCategories.forEach((category) => {
      const subs = allSubCategories.filter(
        (sub) => category.id === sub.category,
      );
      this.categorySettings.push({ category: category, subCategories: subs });
    });
  }

  editCategory(settings?: CategorySettings | null) {
    const dialog = this.dialog.open(CategoryEditComponent, {
      maxWidth: '850px',
      position: {
        top: '5%',
      },
      data: { settings: settings ?? null, task: settings ? 'edit' : 'add' },
    });
    dialog.afterClosed().subscribe((result: boolean | undefined) => {
      if (result !== undefined) {
        const message = result ? 'Updated!' : 'Failed!';
        const action = result ? 'Success' : 'Error';
        this.snackBar.open(message, action, {
          duration: 3000,
        });
        this.prepareCategories();
      }
    });
  }

  deleteCategory(settings: CategorySettings) {
    const confirm = this.dialog.open(ActionConfirmComponent, {
      maxWidth: DIALOG_WIDTH,
      position: {
        top: DIALOG_TOP_POSITION,
      },
      data: { settings },
    });
    confirm.afterClosed().subscribe((result: boolean | undefined) => {
      if (result !== undefined) {
        const message = result ? 'Deleted!' : 'Failed!';
        const action = result ? 'Success' : 'Error';
        this.snackBar.open(message, action, {
          duration: 3000,
        });
        this.prepareCategories();
      }
    });
  }
}
