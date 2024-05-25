import { Component } from '@angular/core';
import { faCirclePlus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { TransactionUpdateDialog } from '../transaction-update/transaction-update.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-submenu',
  templateUrl: './submenu.component.html',
  styleUrl: './submenu.component.css',
})
export class SubmenuComponent {
  protected readonly faCirclePlus = faCirclePlus;
  protected readonly faPlus = faPlus;

  constructor(private dialog: MatDialog) {}

  addTransaction() {
    this.dialog.open(TransactionUpdateDialog, {
      width: '850px',
      position: {
        top: '50px',
      },
      data: { formData: null, task: 'add' },
    });
  }
}
