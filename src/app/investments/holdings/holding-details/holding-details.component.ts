import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Holding, StockDailyPrice, StockPurchaseHistory} from "../../model/investment";
import {MatTableDataSource} from "@angular/material/table";

interface HoldingDetailsData {
  symbol: string;
  holdingData: Holding;
  purchaseHistory: StockPurchaseHistory[];
  stockPriceHistory: StockDailyPrice[];
}

@Component({
  selector: 'app-holding-details',
  templateUrl: './holding-details.component.html',
  styleUrl: './holding-details.component.css',
})
export class HoldingDetailsComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<HoldingDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: HoldingDetailsData,
  ) {}

  displayedColumns: string[] = ['Date', 'Shares', 'TotalPurchase', 'PurchasePrice', 'CurrentValue', 'Profit'];
  dataSource = new MatTableDataSource<StockPurchaseHistory>();
  dailyPrice: [[string, any, any, any, any]] = [['date', 'price', {'type': 'string', 'role': 'annotation'}, 'average', {'type': 'string', 'role': 'annotation'}]];
  dailyPriceOptions: any = {}
  dailyPriceChartType: string = 'line';

  ngOnInit() {
    this.dataSource = new MatTableDataSource<StockPurchaseHistory>(this.data.purchaseHistory);
    this.prepareDailyPriceChart()
  }

  prepareDailyPriceChart() {
    const allPurchaseDates = this.data.purchaseHistory.map(x => x.purchase_date)
    this.data.stockPriceHistory.forEach(x => {
      let point = null;
      if (allPurchaseDates.includes(x.date)) {
        point = `Buy (${x.date})`
      }
      this.dailyPrice.push([x.date, x.current_price, point, this.data.holdingData.average_price, null])
    })
    this.dailyPrice[this.dailyPrice.length - 1][4] = 'Average purchase price';
    this.dailyPriceOptions = {
      title: `Stock Price`,
      width: 850,
      height: 300,
      hartArea: { left: 0, top: 10, width: '100%', height: '70%' },
      legend: { position: 'none' },
      series: {
        0: { type: 'line', lineWidth: 3, color: '#25a5f4'},
        1: { type: 'line', lineDashStyle: [10, 2], lineWidth: 2, color: '#ca3c49'  }
      },
    };
  }
  childRendered() {

  }
}
