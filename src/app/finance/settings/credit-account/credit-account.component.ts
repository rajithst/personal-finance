import { Component, inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AccountEditComponent } from './account-edit/account-edit.component';
import { CreditAccount } from '../../model/account';
import {
  MatTableDataSource,
  MatTable,
  MatColumnDef,
  MatHeaderCellDef,
  MatHeaderCell,
  MatCellDef,
  MatCell,
  MatHeaderRowDef,
  MatHeaderRow,
  MatRowDef,
  MatRow,
} from '@angular/material/table';
import { MatButton, MatIconButton } from '@angular/material/button';
import {
  MatCard,
  MatCardHeader,
  MatCardTitle,
  MatCardContent,
} from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { FinanceStore } from '../../../core/store/finance.store';

const DIALOG_WIDTH = '900px';
const DIALOG_TOP_POSITION = '5%';

@Component({
  selector: 'app-credit-account',
  templateUrl: './credit-account.component.html',
  styleUrl: './credit-account.component.scss',
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatButton,
    MatCardContent,
    MatTable,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCellDef,
    MatCell,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    MatIcon,
    MatIconButton,
  ],
})
export class CreditAccountComponent implements OnInit {
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  private readonly store = inject(FinanceStore);

  dataSource = new MatTableDataSource<CreditAccount>([]);

  displayedColumns = ['account_name', 'account_type', 'description', 'action'];

  ngOnInit(): void {
    this.prepareAccounts();
  }

  prepareAccounts() {
    this.dataSource = new MatTableDataSource<CreditAccount>(
      this.store.creditAccounts(),
    );
  }

  editAccount(element?: CreditAccount) {
    const dialog = this.dialog.open(AccountEditComponent, {
      maxWidth: DIALOG_WIDTH,
      position: {
        top: DIALOG_TOP_POSITION,
      },
      data: { account: element ?? null, task: 'edit' },
    });
    dialog.afterClosed().subscribe((result: CreditAccount | null) => {
      this.prepareAccounts();
      const message = result
        ? 'Updated Successfully!'
        : 'Failed to update accounts!';
      const action = result ? 'Success' : 'Error';
      this.snackBar.open(message, action, {
        duration: 3000,
      });
    });
  }
}
