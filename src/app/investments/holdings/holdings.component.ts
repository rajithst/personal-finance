import { Component, inject, OnDestroy, OnInit } from '@angular/core';
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
import { Observable, of, ReplaySubject, takeUntil } from 'rxjs';
import { Holding } from '../model/holding';
import { InvestmentStore } from '../../core/store/investment.store';
import { DataService } from '../../service/data.service';
import { LoadingService } from '../../service/loading.service';

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
export class HoldingsComponent implements OnInit, OnDestroy {
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  private readonly apiService = inject(ApiService);
  private readonly store = inject(InvestmentStore);
  private readonly destroyed$ = new ReplaySubject<void>(1);
  private readonly dataService = inject(DataService);
  private readonly loading = inject(LoadingService);

  holdings$: Observable<Holding[]> | null;

  ngOnInit(): void {
    this.getHoldings().then(() => this.loading.setLoading(false));

    this.dataService.portfolioSwitcher
      .pipe(takeUntil(this.destroyed$))
      .subscribe((portfolioId) => {
        if (!portfolioId) {
          return;
        }
        this.getHoldings().then(() => this.loading.setLoading(false));
      });
  }

  async getHoldings() {
    this.loading.setLoading(true);
    const holdings = await this.apiService.getHoldings(
      this.store.currentPortfolio()?.id ?? 0,
    );
    this.holdings$ = of(holdings ?? []);
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
    dialog.afterClosed().subscribe((result: Holding | null | undefined) => {
      if (result !== undefined && result !== null) {
        this.getHoldings().then(() => {
          this.snackBar.open('Added Successfully!', 'Success', {
            duration: 3000,
          });
        });
      } else if (result === null) {
        this.snackBar.open('Failed!', 'Error', {
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
    dialog.afterClosed().subscribe((result: boolean | undefined) => {
      if (result !== undefined) {
        const message = result ? 'Imported Successfully!' : 'Failed to import!';
        const action = result ? 'Success' : 'Error';
        this.snackBar.open(message, action, {
          duration: 3000,
        });
        this.getHoldings().then();
      }
    });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
