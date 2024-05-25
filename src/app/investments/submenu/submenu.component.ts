import { Component } from '@angular/core';
import {
  faCirclePlus,
  faEllipsis,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import { TradeDialogComponent } from '../trade-dialog/trade-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-investment-submenu',
  templateUrl: './submenu.component.html',
  styleUrl: './submenu.component.css',
})
export class SubmenuComponent {
  constructor(private dialog: MatDialog) {}
  protected readonly faPlus = faPlus;
  protected readonly faCirclePlus = faCirclePlus;

  addTransaction() {
    this.dialog.open(TradeDialogComponent, {
      width: '750px',
      position: {
        top: '50px',
      },
      data: { formData: null, task: 'add' },
    });
  }
}
