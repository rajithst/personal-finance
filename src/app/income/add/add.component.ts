import { Component } from '@angular/core';

interface IncomeType {
  value: string;
  viewValue: string;
}

interface MonthsType {
  value: number;
  viewValue: string;
}

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrl: './add.component.css'
})
export class AddComponent {
  
  monthNames: string[] = ['January',  'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  months: MonthsType[] = this.monthNames.map((month, index) => {return { value: index +1, viewValue: month } });
  incomeTypes: IncomeType[] = [
    {
      value: 'paycheck',
      viewValue: 'Pay Check'
    },
    {
      value: 'freelancing',
      viewValue: 'Freelancing'
    },
    {
      value: 'rental',
      viewValue: 'Rental'
    },
    {
      value: 'other',
      viewValue: 'Other'
    }
  ];
  incomeForm: any;

}
