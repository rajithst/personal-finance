import {Component, computed, inject, OnInit, signal} from '@angular/core';
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
import {Holding} from "../model/investment";

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
  holdings = signal<Holding[]>(this.sessionData.holdings);

  totalShares = computed(() => {
    return this.holdings().reduce((ac, cv) => ac + cv['quantity'], 0);
  });
  totalInvestment = computed(() => {
    return this.holdings().filter(x => x.stock_currency === '$').filter(x => x.stock_currency === '$').reduce((ac, cv) => ac + cv['total_investment'], 0);
  });
  totalCurrentPrice = computed(() => {
    return this.holdings().filter(x => x.stock_currency === '$').reduce((ac, cv) => ac + cv['current_value'], 0);
  });

  totalProfit = computed(() => {
    return this.holdings().filter(x => x.stock_currency === '$').reduce((ac, cv) => ac + cv['profit_loss'], 0);
  });

  totalProfitPercentage = computed(() => {
    return (this.totalProfit() / this.totalInvestment()) * 100;
  })

  currency: string = '$';

  sectorWiseUsStockSum: [[string, any]] = [['Sector', 'Total']];
  sectorWiseUsStockSumOptions: any;
  sectorWiseUsStockSumChartType: string = 'pie';

  sectorWiseUsStockInvestmentOptions: any;
  sectorWiseUsStockInvestmentChartType: string = 'bar';

  sectorWiseDomesticStockSum: [[string, any]] = [['Sector', 'Total']];
  sectorWiseDomesticStockSumOptions: any;
  sectorWiseDomesticStockSumChartType: string = 'pie';

  sectorWiseDomesticStockInvestmentOption: any;
  sectorWiseDomesticStockInvestmentChartType: string = 'bar';

  securityWiseUsStockSum: [[string, any]] = [['Security', 'Total']];
  securityWiseUsStockSumOptions: any;
  securityWiseUsStockSumChartType: string = 'pie';

  securityWiseDomesticStockSum: [[string, any]] = [['Security', 'Total']];
  securityWiseDomesticStockSumOptions: any;
  securityWiseDomesticStockSumChartType: string = 'pie';

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
    this.prepareData();
  }


  prepareData() {
    this.monthlyAccumulatedInvestedSum();
    this.monthlyDividendPayment();
    this.categoryBySector();
    this.categoryBySecurity();
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
      height: 300,
      vAxis: { format: 'decimal' },
      hAxis: {
        slantedText: true,
        slantedTextAngle: 90,
      },
      chartArea: { left: 0, right: 0, top: 100, width: '100%', height: '70%' },

      fontSize: 12,
      legend: { position: 'none' },
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
        monthsTotal = currentMonthTransaction.reduce((total, transaction) => {
          return total + transaction.purchase_price * transaction.quantity;
        }, 0);
        if (this.monthlyAccInvestedSum.length > 1) {
          const lastMonthAccSum =
            this.monthlyAccInvestedSum[this.monthlyAccInvestedSum.length - 1];
          this.monthlyAccInvestedSum.push([
            x.viewValue,
            lastMonthAccSum[1] + monthsTotal,
          ]);
        } else {
          this.monthlyAccInvestedSum.push([x.viewValue, monthsTotal]);
        }
      }
      this.monthlyInvestedSum.push([x.viewValue, monthsTotal]);
    });
    this.monthlyAccInvestedSumOptions = {
      title: `Investment History`,
      width: 400,
      height: 300,
      fontSize: 12,
      legend: { position: 'none' },
    };
    this.monthlyInvestedSumOptions = {
      title: `Monthly Investment History`,
      width: 400,
      height: 300,
      fontSize: 12,
      legend: { position: 'none' },
    };
  }

  categoryBySector() {
    const holdings = this.sessionData.holdings;
    if (holdings && holdings.length > 0) {
      SECTOR.forEach((x) => {
        const usHoldings = holdings.filter(
          (y) => y.sector == x.viewValue && y.stock_currency === '$',
        );
        const domesticHoldings = holdings.filter(
          (y) => y.sector == x.viewValue && y.stock_currency === '¥',
        );
        const usHoldingTotalInvestment = usHoldings.reduce(
          (acc, holding) => acc + holding.total_investment!,
          0,
        );
        const domesticHoldingTotalInvestment = domesticHoldings.reduce(
          (acc, holding) => acc + holding.total_investment!,
          0,
        );
        this.sectorWiseUsStockSum.push([x.viewValue, usHoldingTotalInvestment]);
        this.sectorWiseDomesticStockSum.push([
          x.viewValue,
          domesticHoldingTotalInvestment,
        ]);
      });
    }
    this.sectorWiseUsStockSumOptions = {
      title: `US Protofolio (Sector)`,
      width: 400,
      height: 300,
      pieHole: 0.2,
      pieSliceText: 'label',
      chartArea: { left: 10, top: 50, width: '80%', height: '70%' },
      pieSliceTextStyle: {
        color: 'black',
        textAlign: 'left',
        fontsize: '10px',
      },
      fontSize: 10,
      legend: { position: 'none' },
    };
    this.sectorWiseDomesticStockSumOptions = {
      title: `Domesitc Protofolio (Sector)`,
      width: 400,
      height: 300,
      pieHole: 0.2,
      pieSliceText: 'label',
      chartArea: { left: 10, top: 50, width: '80%', height: '70%' },
      pieSliceTextStyle: {
        color: 'black',
        textAlign: 'left',
        fontsize: '10px',
      },
      fontSize: 10,
      legend: { position: 'none' },
    };
    this.sectorWiseUsStockInvestmentOptions = {
      title: `US Stock Investment (Sector)`,
      width: 400,
      height: 300,
      is3D: true,
      bars: 'horizontal',
      chartArea: { left: 10, top: 50, width: '100%', height: '70%' },
      legend: { position: 'none' },
    };
    this.sectorWiseDomesticStockInvestmentOption = {
      title: `Domestic Stock Investment (Sector)`,
      width: 400,
      height: 300,
      is3D: true,
      bars: 'horizontal',
      chartArea: { left: 10, top: 50, width: '100%', height: '70%' },
      legend: { position: 'none' },
    };
  }

  categoryBySecurity() {
    const holdings = this.sessionData.holdings;
    holdings
      .filter((y) => y.stock_currency === '$')
      .forEach((hld) => {
        this.securityWiseUsStockSum.push([hld.company, hld.total_investment]);
      });
    holdings
      .filter((y) => y.stock_currency === '¥')
      .forEach((hld) => {
        this.securityWiseDomesticStockSum.push([hld.company, hld.total_investment]);
      });

    this.securityWiseUsStockSumOptions = {
      title: `US Protofolio (Security)`,
      width: 400,
      height: 300,
      pieHole: 0.2,
      pieSliceText: 'label',
      chartArea: { left: 10, top: 50, width: '80%', height: '70%' },
      pieSliceTextStyle: {
        color: 'black',
        textAlign: 'left',
        fontsize: '10px',
      },
      fontSize: 10,
      legend: { position: 'none' },
    };
    this.securityWiseDomesticStockSumOptions = {
      title: `US Protofolio (Security)`,
      width: 400,
      height: 300,
      pieHole: 0.2,
      pieSliceText: 'label',
      chartArea: { left: 10, top: 50, width: '80%', height: '70%' },
      pieSliceTextStyle: {
        color: 'black',
        textAlign: 'left',
        fontsize: '10px',
      },
      fontSize: 10,
      legend: { position: 'none' },
    };
  }
  childRendered() {}
}
