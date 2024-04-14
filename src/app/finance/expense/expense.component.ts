import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SessionEventMessage, SessionService } from '../../core/session.service';
import {MONTHS, YEARS, PAYMENT_METHODS, EXPENSE_CATEGORIES, EXPENSE_SUB_CATEGORIES} from "../../shared/static/client_data";
import {DropDownType} from "../../shared/interface/common.data";
import {MonthlyTransaction, Transaction} from "../../shared/interface/transactions";
import Highcharts from 'highcharts';




@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrl: './expense.component.css',
})
export class ExpenseComponent implements OnInit {

  private message =  this.sessionService.getEventMessage();
  private sessionData = this.sessionService.getData();


  displayedColumns: string[] = ['date', 'category', 'subcategory', 'payment_method', 'amount', 'destination', 'actions'];

  expenseData: MonthlyTransaction[] = [];
  Highcharts: typeof Highcharts = Highcharts;
  chartOptionsColumn: Highcharts.Options = {};
  chartOptionsPie: Highcharts.Options = {};



  constructor(private dialog: MatDialog,
    private sessionService: SessionService) {
  }
  ngOnInit() {
    this.message.subscribe((msg: SessionEventMessage)  => {
      if (msg === SessionEventMessage.INIT_SESSION_LOAD_SUCCESS || msg == SessionEventMessage.SESSION_TRANSACTION_UPDATE_SUCCESS) {
        this.filterData()
        this.prepareColumnChart()
        this.preparePieChart()
      }
    })
  }

  private prepareColumnChart() {
    this.chartOptionsColumn = {
      chart: {
        type: 'column',
      },
      xAxis: {
        categories: this.expenseData.map(x => x.month_text)
      },
      yAxis: {
        title: {
          text: '2024'
        }
      },
      series: [{
        type: 'column',
        name: '2024',
        data: this.expenseData.map(x => x.total)
      }]
    };
  }

  private filterData() {
    console.log('preparing')
    // const years: number[] = this.filters.years || [];
    // const months: number[] = this.filters.months || [];
    // const paymentMethods: number[] = this.filters.paymentMethods || [];
    // const expenseCategories: number[] = this.filters.categories || [];
    // const expenseSubCategories: number[] = this.filters.subcategories || [];
    // const searchQuery: string = this.filters.q;
    // const currData = this.sessionData.expenses.filter(x => years.includes(x.year))
    //                                     .filter(x => months.length > 0 ? months.includes(x.month) : true)
    //                                     .sort(((x, y) => y.month - x.month))
    //                                     .sort(((x, y) => y.year - x.year))
    // currData.forEach(x => {
    //     x.transactions_cp = x.transactions.filter(y => paymentMethods && paymentMethods.length > 0 ? paymentMethods.includes(y.payment_method) : true)
    //       .filter(y => expenseCategories.length >  0 ? expenseCategories.includes(y.category) : true)
    //       .filter(y => expenseSubCategories.length > 0 ? expenseSubCategories.includes(y.subcategory) : true )
    //       .filter(y => searchQuery.length > 0 ? y.destination.includes(searchQuery) || y.alias?.includes(searchQuery) :  true)
    //   })
    this.expenseData = this.sessionData.expenses;
  }

  private preparePieChart() {
    this.chartOptionsPie = {
        chart: {
              type: 'pie'
        },
        title: {
              text: 'Egg Yolk Composition'
        },
        series: [
          {
            name: 'Percentage',
            type: 'pie',
            data: [
                {

                    name: 'Water',
                    y: 55.02
                },
                {
                    name: 'Fat',
                    sliced: true,
                    selected: true,
                    y: 26.71
                },
                {
                    name: 'Carbohydrates',
                    y: 1.09
                },
                {
                    name: 'Protein',
                    y: 15.5
                },
                {
                    name: 'Ash',
                    y: 1.68
                }
            ]
          }
        ]
    }
  }
}
