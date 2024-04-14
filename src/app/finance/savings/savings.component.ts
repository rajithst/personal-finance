import {Component, OnInit} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {SessionEventMessage, SessionService} from "../../core/session.service";
import {DropDownType} from "../../shared/interface/common.data";
import {MONTHS, YEARS, SAVING_CATEGORIES} from "../../shared/static/client_data";
import {MonthlyTransaction, Transaction} from "../../shared/interface/transactions";

@Component({
  selector: 'app-savings',
  templateUrl: './savings.component.html',
  styleUrl: './savings.component.css'
})
export class SavingsComponent implements OnInit{

  private message =  this.sessionService.getEventMessage();
  private sessionData = this.sessionService.getData();

  constructor(public dialog: MatDialog, private sessionService: SessionService,) {}

  YEARS: DropDownType[] = YEARS
  MONTHS: DropDownType[] = MONTHS
  SAVING_CATEGORIES: DropDownType[] = SAVING_CATEGORIES
  displayedColumns: string[] = ['date', 'category', 'subcategory', 'payment_method', 'amount', 'destination', 'actions'];
  savingData: MonthlyTransaction[] = [];
  searchQuery: string = '';
  savingCategory: number[] = [];
  dataYear: number[] = [2024];
  dataMonth: number[] = [1, 2, 3];

  ngOnInit() {
    this.message.subscribe((msg: SessionEventMessage)  => {
      if (msg === SessionEventMessage.INIT_SESSION_LOAD_SUCCESS || msg === SessionEventMessage.SESSION_TRANSACTION_UPDATE_SUCCESS) {
        this.savingData =  JSON.parse(JSON.stringify(this.sessionData.saving));
      }
    })
  }

  addSaving() {
    // this.dialog.open(SavingsDialog, {
    //   width: '850px',
    //   position: {
    //     top: '50px',
    //   },
    //   data: {'formData': null}
    // });
  }


  onSearch() {

  }
  onSelectionChange() {

  }

}
