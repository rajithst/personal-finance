import { Component, inject, OnInit } from '@angular/core';
import { SessionService } from '../service/session.service';
import { MONTHS } from '../../data/client.data';
import { SECTOR } from '../../data/investments.data';

import {
  faCaretDown,
  faCaretUp,
  faJpy,
  faLineChart,
  faMoneyBill,
} from '@fortawesome/free-solid-svg-icons';
import { DropDownType } from '../../data/shared.data';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  protected readonly faCaretUp = faCaretUp;
  protected readonly faLineChart = faLineChart;
  protected readonly faJpy = faJpy;
  protected readonly faMoneyBill = faMoneyBill;
  protected readonly faCaretDown = faCaretDown;
  protected readonly Math = Math;

  private sessionService = inject(SessionService);
  sessionData = this.sessionService.getData();
  SECTORS: DropDownType[] = SECTOR;
  totalShares: number = 0;
  totalInvestment: number = 0;
  totalCurrentPrice: number = 0;
  totalProfit: number = 0;
  totalProfitPercentage: number = 0;
  currency: string = 'USD';

  sectorWiseSum: [[string, any]] = [['Sector', 'Total']];
  sectorWiseSumOptions: any;
  sectorWiseSumChartType: string = 'pie';

  sectorWiseDomesticSum: [[string, any]] = [['Sector', 'Total']];
  sectorWiseDomesticSumOptions: any;
  sectorWiseDomesticSumChartType: string = 'pie';

  monthlyAccInvestedSum: [[string, any]] = [['Month', 'Total']];
  monthlyAccInvestedSumOptions: any;
  monthlyAccInvestedSumChartType: string = 'line';

  monthlyDividend: [[string, any]] = [['Month', 'Total']];
  monthlyDividendOptions: any;
  monthlyDividendChartType: string = 'bar';

  monthlyInvestedSum: [[string, any]] = [['Month', 'Total']];
  monthlyInvestedSumOptions: any;
  monthlyInvestedSumChartType: string = 'bar';

  ngOnInit(): void {
    this.sessionData = this.sessionService.getData();
    this.prepareAnalytics();
    this.prepareData();
  }

  prepareAnalytics() {
    const holdings = this.sessionData.holdings.filter(
      (x) => x.stock_currency === '$',
    );
    this.currency = '$';
    this.totalShares = holdings.reduce((ac, cv) => ac + cv['quantity'], 0);
    this.totalInvestment = holdings.reduce(
      (ac, cv) => ac + cv['total_investment'],
      0,
    );
    this.totalCurrentPrice = holdings.reduce(
      (ac, cv) => ac + cv['current_value'],
      0,
    );
    this.totalProfit = holdings.reduce((ac, cv) => ac + cv['profit_loss'], 0);
    this.totalProfitPercentage =
      (this.totalProfit / this.totalInvestment) * 100;
  }
  prepareData() {
    this.monthlyAccumulatedInvestedSum();
    this.monthlyDividendPayment();
    this.categoryBySector();
    this.categoryBySectorDomestic();
  }

  monthlyDividendPayment() {
    const usDividends = this.sessionData.dividends.us;
    MONTHS.forEach((x) => {
      const currentMonthsDividend = usDividends.filter(
        (usd) => usd.month === x.value,
      );
      if (currentMonthsDividend.length > 0) {
        this.monthlyDividend.push([
          x.viewValue,
          currentMonthsDividend[0].total,
        ]);
      } else {
        this.monthlyDividend.push([x.viewValue, 0]);
      }
    });
    this.monthlyDividendOptions = {
      title: `Monthly Dividend History`,
      width: 400,
      height: 400,
      vAxis: { format: 'decimal' },
      hAxis: {
        slantedText: true,
        slantedTextAngle: 90,
      },
      chartArea: { left: 10, top: 50, width: '100%', height: '70%' },
      bar: { groupWidth: '50%' },

      fontSize: 12,
      legend: 'none',
    };
  }

  monthlyAccumulatedInvestedSum() {
    const transactions = this.sessionData.transactions;
    const date = new Date();
    const year = date.getFullYear();
    MONTHS.forEach((x) => {
      const currentMonthTransaction = transactions.filter(
        (y) =>
          y.year === year && y.month === x.value && y.stock_currency === '$',
      );
      let monthsTotal = 0;
      if (currentMonthTransaction.length > 0) {
        monthsTotal = currentMonthTransaction.reduce(
          (total, transaction) => {
            return total + transaction.purchase_price * transaction.quantity;
          },
          0,
        );
        if (this.monthlyAccInvestedSum.length > 1) {
          const lastMonthAccSum =
            this.monthlyAccInvestedSum[this.monthlyAccInvestedSum.length - 1];
          this.monthlyAccInvestedSum.push([
            x.viewValue,
            lastMonthAccSum[1] + monthsTotal,
          ]);
        } else {
          this.monthlyAccInvestedSum.push([
            x.viewValue,
            monthsTotal,
          ]);
        }
      }
      this.monthlyInvestedSum.push([x.viewValue, monthsTotal]);
    });
    this.monthlyAccInvestedSumOptions = {
      title: `Investment History`,
      width: 600,
      height: 400,
      fontSize: 12,
      legend: 'none',
    };
    this.monthlyInvestedSumOptions = {
      title: `Monthly Investment History`,
      width: 400,
      height: 400,
      fontSize: 12,
      legend: 'none',
    };
  }

  categoryBySector() {
    const holdings = this.sessionData.holdings;
    if (holdings && holdings.length > 0) {
      SECTOR.forEach((x) => {
        const cSum = holdings
          .filter((y) => y.sector == x.viewValue && y.stock_currency === '$')
          .reduce((acc, holding) => acc + holding.total_investment!, 0);
        if (cSum > 0) {
          this.sectorWiseSum.push([x.viewValue, cSum]);
        }
      });
    }
    this.sectorWiseSumOptions = {
      title: `Sector (US Stocks)`,
      width: 400,
      height: 400,
      pieHole: 0.2,
      pieSliceText: 'label',
      pieSliceTextStyle: {
        color: 'black',
        textAlign: 'left',
        fontsize: '10px',
      },
      fontSize: 12,
      legend: 'none',
    };
  }

  categoryBySectorDomestic() {
    const holdings = this.sessionData.holdings;
    if (holdings && holdings.length > 0) {
      SECTOR.forEach((x) => {
        const cSum = holdings
          .filter((y) => y.sector == x.viewValue && y.stock_currency === '¥')
          .reduce((acc, holding) => acc + holding.total_investment!, 0);
        this.sectorWiseDomesticSum.push([x.viewValue, cSum]);
      });
    }
    this.sectorWiseDomesticSumOptions = {
      title: `Sector (Domestic Stocks)`,
      width: 400,
      height: 400,
      pieHole: 0.2,
      pieSliceText: 'label',
      pieSliceTextStyle: {
        color: 'black',
        textAlign: 'left',
        fontsize: '10px',
      },
      fontSize: 12,
      legend: 'none',
    };
  }
  childRendered() {}
}
