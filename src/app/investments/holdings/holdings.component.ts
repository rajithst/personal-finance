import { Component, inject, OnInit } from '@angular/core';
import { Holding } from '../model/investment';
import { faCirclePlus, faUpload } from '@fortawesome/free-solid-svg-icons';
import { MatDialog } from '@angular/material/dialog';
import { HoldingUpdateComponent } from './holding-update/holding-update.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HoldingTableComponent } from './holding-table/holding-table.component';
import { MatTabGroup, MatTab } from '@angular/material/tabs';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { MatTooltip } from '@angular/material/tooltip';
import { MatRipple } from '@angular/material/core';
import { MatGridList, MatGridTile } from '@angular/material/grid-list';
import { AsyncPipe, DecimalPipe } from '@angular/common';
import { MatChip } from '@angular/material/chips';
import { MatIcon } from '@angular/material/icon';
import { MatMiniFabButton } from '@angular/material/button';
import { HoldingImportComponent } from './holding-import/holding-import.component';
import { ApiService } from '../../core/api.service';
import { Observable, of } from 'rxjs';

const DIALOG_WIDTH = '900px';
const DIALOG_TOP_POSITION = '5%';

@Component({
  selector: 'app-holdings',
  templateUrl: './holdings.component.html',
  styleUrl: './holdings.component.scss',
  standalone: true,
  imports: [
    MatGridList,
    MatGridTile,
    MatRipple,
    MatTooltip,
    FaIconComponent,
    MatTabGroup,
    MatTab,
    HoldingTableComponent,
    DecimalPipe,
    MatChip,
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

  applyFilter() {}

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

  openFilters() {}

  showValueAction() {}
}
