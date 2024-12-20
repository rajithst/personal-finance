import { Component, inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HoldingUpdateComponent } from './holding-update/holding-update.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HoldingTableComponent } from './holding-table/holding-table.component';
import { MatTooltip } from '@angular/material/tooltip';
import { AsyncPipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatMiniFabButton } from '@angular/material/button';
import { HoldingImportComponent } from './holding-import/holding-import.component';
import { ApiService } from '../../core/api.service';
import { Observable } from 'rxjs';
import { Holding } from '../model/holding';

const DIALOG_WIDTH = '900px';
const DIALOG_TOP_POSITION = '5%';

@Component({
  selector: 'app-holdings',
  templateUrl: './holdings.component.html',
  styleUrl: './holdings.component.scss',
  imports: [
    MatTooltip,
    HoldingTableComponent,
    MatIcon,
    MatMiniFabButton,
    AsyncPipe,
  ],
})
export class HoldingsComponent implements OnInit {
  holdings$: Observable<Holding[]>;
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  private readonly apiService = inject(ApiService);
  showValues = true;

  ngOnInit(): void {
    this.getHoldings();
  }

  getHoldings() {
    this.holdings$ = this.apiService.getHoldings();
  }

  addTransaction() {
    const dialog = this.dialog.open(HoldingUpdateComponent, {
      maxWidth: '800px',
      maxHeight: '500px',
      position: {
        top: '10%',
      },
      data: { task: 'add' },
    });
    dialog.afterClosed().subscribe((result) => {
      if (result.refresh) {
        this.snackBar.open('Updated!', 'Success', {
          duration: 3000,
        });
      }
    });
  }

  importTransaction() {
    const dialog = this.dialog.open(HoldingImportComponent, {
      maxWidth: DIALOG_WIDTH,
      disableClose: true,
      position: {
        top: DIALOG_TOP_POSITION,
      },
    });
    dialog.afterClosed().subscribe((result) => {
      if (result.refresh) {
        this.getHoldings();
      }
    });
  }
}
