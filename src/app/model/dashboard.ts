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
