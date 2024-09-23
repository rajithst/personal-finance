import { DropDownType } from '../data/shared.data';

interface DashboardTransaction {
  year: number;
  month: number;
  amount: number;
}

interface MonthlyPayment {
  [date: string]: DestinationAmount[];
}

export interface DashboardResponse {
  expense: DashboardTransaction[];
  payment: DashboardTransaction[];
  saving: DashboardTransaction[];
  income: DashboardTransaction[];
  category_wise_expenses: MonthlyCategorySum;
  account_wise_expenses: MonthlyCategorySum;
  payment_by_destination: MonthlyPayment;
}

interface DestinationAmount {
  amount: number;
  destination: string;
  destination_original: string;
}

interface MonthlyCategorySum {
  [date: string]: CategoryAmount[];
}

interface CategoryAmount {
  category_id: number;
  amount: number;
}

interface KeyValueTuple {
  0: string;
  1: any;
}

interface KeyValueTupleExtend {
  0: string;
  1: any;
  2: any;
}

export type KeyValueArray = KeyValueTuple[] | KeyValueTupleExtend[];

export interface ChartData {
  chartKey: string;
  data: KeyValueArray;
  options: any;
  chartType: string;
  chartSwitches: DropDownType[] | null;
}

export interface ChartOptionSwitchEmit {
  chartKey: string;
  chartSwitch: DropDownType;
}

export const PIE_CHART_CONFIG = {
  title: '',
  width: 550,
  height: 300,
  pieHole: 0.2,
  pieSliceText: 'percentage',
  chartArea: { left: 30, top: 50, width: '90%', height: '70%' },
  is3D: true,
  pieSliceTextStyle: {
    color: 'black',
    textAlign: 'left',
    fontsize: '10px',
  },
  fontSize: 10,
  legend: { position: 'right' },
};

export const BAR_MULTI_CHART_CONFIG = {
  title: '',
  width: 580,
  height: 300,
  colors: ['#cf5a5a', '#d59b6c'],
  chartArea: { left: 0, top: 20, width: '100%', height: '70%' },
  legend: { position: 'right', textStyle: { color: 'blue', fontSize: 10 } },
};

export const BAR_CHART_CONFIG = {
  title: '',
  width: 580,
  height: 300,
  colors: ['#23c623'],
  chartArea: { left: 0, top: 20, width: '100%', height: '70%' },
  legend: { position: 'none', textStyle: { color: 'blue', fontSize: 10 } },
};

export const HORIZONTAL_BAR_CHART_CONFIG = {
  title: '',
  width: 550,
  height: 300,
  is3D: true,
  bars: 'horizontal',
  chartArea: { left: 30, top: 50, width: '90%', height: '70%' },
  legend: { position: 'none' },
};
