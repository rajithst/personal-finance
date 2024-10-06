import { Component, inject } from '@angular/core';
import { DataService } from '../../service/data.service';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import { SUCCESS_ACTION } from '../../data/client.data';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AccountEditComponent } from './account-edit/account-edit.component';
import { CreditAccount } from '../../model/account';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-credit-account',
  templateUrl: './credit-account.component.html',
  styleUrl: './credit-account.component.css',
})
export class CreditAccountComponent {
  private readonly dataService = inject(DataService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  accounts = this.dataService.getAccounts();
  dataSource = new MatTableDataSource<CreditAccount>(this.accounts);

  displayedColumns = ['account_name', 'account_type', 'description', 'action'];
  protected readonly faPencil = faPencil;

  editAccount(element: CreditAccount) {
    const dialog = this.dialog.open(AccountEditComponent, {
      data: { account: element, task: 'edit' },
    });
    dialog.afterClosed().subscribe((result: any) => {
      if (result.action === SUCCESS_ACTION) {
        const targetId = this.accounts.findIndex((x) => x.id === element.id);
        if (targetId !== -1) {
          this.accounts[targetId] = result.data;
          this.dataSource.data = this.accounts;
          this.refreshClientSettings();
          this.snackBar.open('Added!.', 'Success', {
            duration: 3000,
          });
        }
      }
    });
  }

  addAccount() {
    const dialog = this.dialog.open(AccountEditComponent, {
      data: { account: null, task: 'add' },
    });
    dialog.afterClosed().subscribe((result: any) => {
      if (result.action === SUCCESS_ACTION) {
        this.accounts.push(result.data);
        this.dataSource.data = this.accounts;
        this.refreshClientSettings();
        this.snackBar.open('Added!.', 'Success', {
          duration: 3000,
        });
      }
    });
  }

  private refreshClientSettings() {
    const clientSettings = this.dataService.getClientSettings();
    clientSettings.accounts = this.accounts;
    this.dataService.setClientSettings(clientSettings);
  }
}
