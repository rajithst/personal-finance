import { Component, inject, OnInit } from '@angular/core';
import { SessionService } from '../service/session.service';
import { Holding } from '../model/investment';
import { faCirclePlus, faUpload } from '@fortawesome/free-solid-svg-icons';
import { MatDialog } from '@angular/material/dialog';
import { HoldingUpdateComponent } from './holding-update/holding-update.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-holdings',
  templateUrl: './holdings.component.html',
  styleUrl: './holdings.component.css',
})
export class HoldingsComponent implements OnInit {
  holdings: Holding[] = [];
  usHoldings: Holding[] = [];
  domesticHoldings: Holding[] = [];
  protected readonly faCirclePlus = faCirclePlus;
  protected readonly faUpload = faUpload;
  private sessionService = inject(SessionService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private sessionData = this.sessionService.getData();

  ngOnInit(): void {
    this.usHoldings = this.sessionData.holdings.filter(
      (holding) => holding.stock_currency === '$',
    );
    this.domesticHoldings = this.sessionData.holdings.filter(
      (holding) => holding.stock_currency === '¥',
    );
  }

  addTransaction() {
    const dialog = this.dialog.open(HoldingUpdateComponent, {
      width: '800px',
      height: '500px',
      position: {
        top: '10%',
      },
      data: { task: 'add' },
    });
    dialog.afterClosed().subscribe((result) => {
      if (result.refresh) {
        this.sessionData = this.sessionService.getData();
        this.usHoldings = this.sessionData.holdings.filter(
          (holding) => holding.stock_currency === '$',
        );
        this.domesticHoldings = this.sessionData.holdings.filter(
          (holding) => holding.stock_currency === '¥',
        );
        this.snackBar.open('Updated!', 'Success', {
          duration: 3000,
        });
      }
    });
  }

  applyFilter() {}
}
