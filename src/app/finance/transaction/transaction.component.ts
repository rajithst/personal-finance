import {Component, OnInit} from '@angular/core';
import {MonthlyTransaction, Transaction} from "../../shared/interface/transactions";
import {MatDialog} from "@angular/material/dialog";
import {SessionEventMessage, SessionService} from "../../core/session.service";
import {NavigationEnd, Router} from "@angular/router";
import {
  MONTHS,
  PAYMENT_METHODS,
  TRANSACTION_CATEGORIES,
  TRANSACTION_SUB_CATEGORIES,
  YEARS
} from "../../shared/static/client_data";
import {TransactionUpdateDialog} from "../transaction-update/transaction-update.component";
import {DropDownType} from "../../shared/interface/common.data";

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrl: './transaction.component.css'
})
export class TransactionComponent implements OnInit {

  private message =  this.sessionService.getEventMessage();
  private sessionData = this.sessionService.getData();

  protected readonly YEARS = YEARS;
  protected readonly MONTHS = MONTHS;
  protected readonly PAYMENT_METHODS = PAYMENT_METHODS;
  protected readonly TRANSACTION_CATEGORIES = TRANSACTION_CATEGORIES;
  protected readonly TRANSACTION_SUB_CATEGORIES: DropDownType[] = [];
  constructor(private dialog: MatDialog,
    private router: Router,
    private sessionService: SessionService) {
  }
  displayedColumns: string[] = ['date', 'category', 'subcategory', 'payment_method', 'amount', 'destination', 'actions'];
  transactionData: MonthlyTransaction[] = [];

  dataYear: number[] = [2024];
  dataMonth: number[] = [1, 2, 3];
  paymentMethod: number[] = []
  transactionCategory: number[] = []
  transactionSubCategory: number[] = []
  searchQuery: string = '';

  ngOnInit() {
    this.message.subscribe((msg: SessionEventMessage)  => {
      if (msg === SessionEventMessage.INIT_SESSION_LOAD_SUCCESS || msg == SessionEventMessage.SESSION_TRANSACTION_UPDATE_SUCCESS) {
        this.filterData()
      }
    })

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.filterData()
      }
    })
  }

  addTransaction() {
    const dialog = this.dialog.open(TransactionUpdateDialog, {
      width: '850px',
      position: {
        top: '50px',
      },
      data: {'formData': null}
    });
  }
  protected filterData() {
    const years: number[] = this.dataYear || [];
    const months: number[] = this.dataMonth || [];
    const paymentMethods: number[] = this.paymentMethod || [];
    const categories: number[] = this.transactionCategory || [];
    const subCategories: number[] = this.transactionSubCategory || [];
    const searchQuery: string = this.searchQuery;

    const currData = this.getDataStream().filter(x => years.includes(x.year))
                                        .filter(x => months.length > 0 ? months.includes(x.month) : true)
                                        .sort(((x, y) => y.month - x.month))
                                        .sort(((x, y) => y.year - x.year))
    currData.forEach(x => {
        x.transactions_cp = x.transactions.filter(y => paymentMethods && paymentMethods.length > 0 ? paymentMethods.includes(y.payment_method) : true)
          .filter(y => categories.length >  0 ? categories.includes(y.category) : true)
          .filter(y => subCategories.length > 0 ? subCategories.includes(y.subcategory) : true )
          .filter(y => searchQuery.length > 0 ? y.destination.includes(searchQuery) || y.alias?.includes(searchQuery) :  true)
        x.total = x.transactions_cp.reduce((total, { amount }) => total + amount, 0);
      })
    this.transactionData = currData
  }

  private getDataStream(): MonthlyTransaction[] {
    const currentURL = this.router.url;
    if (currentURL === '/expense') {
      return this.sessionData.expenses;
    } else if (currentURL === '/savings') {
      return this.sessionData.saving
    } else if (currentURL === '/payments') {
      return this.sessionData.payments
    } else {
      return []
    }
  }

}
