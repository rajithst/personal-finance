import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import moment from 'moment';
import { ApiService } from '../../../core/api.service';

interface IncomeType {
  value: number;
  viewValue: string;
}

interface MonthsType {
  value: number;
  viewValue: string;
}

@Component({
  selector: 'app-income-add',
  templateUrl: './income_add.component.html',
  styleUrl: './income_add.component.css'
})
export class IncomeAddComponent {
  
  monthNames: string[] = ['January',  'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  months: MonthsType[] = this.monthNames.map((month, index) => {return { value: index +1, viewValue: month } });
  incomeTypes: IncomeType[] = [
    {
      value: 1,
      viewValue: 'Pay Check'
    },
    {
      value: 2,
      viewValue: 'Freelancing'
    },
    {
      value: 3,
      viewValue: 'Rental'
    },
    {
      value: 4,
      viewValue: 'Cash Back'
    },
    {
      value: 5,
      viewValue: 'Interest'
    },
    {
      value: 6,
      viewValue: 'Other'
    }
  ];
  incomeForm = this.formBuilder.group({
    category: ['', Validators.required],
    amount: ['', [Validators.required]],
    date: ['', Validators.required],
    target_month: [''],
    notes: ['']
  });
  constructor(private formBuilder: FormBuilder, private http: ApiService) {}


  submit() {
    //console.log(this.incomeForm.value)
    this.incomeForm.value.date = moment(this.incomeForm.value.date).format('YYYY-MM-DD');
    this.http.addIncome(this.incomeForm.value).subscribe(income => console.log(income))
  }
}
