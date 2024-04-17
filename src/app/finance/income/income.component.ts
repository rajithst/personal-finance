import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IncomeDialog } from './income_add/income_add.component';
import { FormGroup, FormControl } from '@angular/forms';
import { Income, MonthlyIncome } from '../../shared/interface/income.data';
import {
  SessionEventMessage,
  SessionService,
} from '../../core/session.service';

@Component({
  selector: 'app-income',
  templateUrl: './income.component.html',
  styleUrl: './income.component.css',
})
export class IncomeComponent implements OnInit {
  constructor(
    private dialog: MatDialog,
    private sessionService: SessionService,
  ) {}

  private sessionData = this.sessionService.getData();
  private message = this.sessionService.getEventMessage();

  incomeRange = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  displayedColumns: string[] = ['date', 'source', 'amount', 'actions'];
  incomeData: MonthlyIncome[] = [];
  chartData: any[] = [];

  ngOnInit() {
    this.message.subscribe((msg: SessionEventMessage) => {
      if (
        msg === SessionEventMessage.INIT_SESSION_LOAD_SUCCESS ||
        msg === SessionEventMessage.SESSION_TRANSACTION_UPDATE_SUCCESS
      ) {
        this.incomeData = JSON.parse(JSON.stringify(this.sessionData.incomes));
        this.prepareChartData();
      }
    });
  }

  addIncome() {
    const dialog = this.dialog.open(IncomeDialog, {
      width: '850px',
      position: {
        top: '50px',
      },
      data: { formData: null },
    });
  }

  editRecord(element: Income) {
    const dialog = this.dialog.open(IncomeDialog, {
      width: '850px',
      position: {
        top: '50px',
      },
      data: { formData: element },
    });
  }

  deleteRecord(element: Income) {
    console.log(element);
  }

  prepareChartData() {}
}
