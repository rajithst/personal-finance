import { Component, OnInit } from '@angular/core';
import { TransactionUpdateDialog } from '../../finance/transaction-update/transaction-update.component';
import { MatDialog } from '@angular/material/dialog';
import { TradeDialogComponent } from '../trade-dialog/trade-dialog.component';
import {SessionService} from "../service/session.service";
import { faCircleUp } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-holdings',
  templateUrl: './holdings.component.html',
  styleUrl: './holdings.component.css',
})
export class HoldingsComponent implements OnInit {
  private sessionData = this.sessionService.getData();
  constructor(private dialog: MatDialog, private sessionService: SessionService) {}
  holdings: any[] = []
  faCircleUp = faCircleUp;
  ngOnInit(): void {
    this.holdings = this.sessionData.holdings
  }

  addTransaction() {
    const dialog = this.dialog.open(TradeDialogComponent, {
      width: '750px',
      position: {
        top: '50px',
      },
      data: { formData: null, task: 'add' },
    });
  }
}
