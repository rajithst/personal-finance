import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IncomeService } from '../income.service';

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
      value: 'cashack',
      viewValue: 'Cash Back'
    },
    {
      value: 'interest',
      viewValue: 'Interest'
    },
    {
      value: 'Points',
      viewValue: 'Points'
    },
    {
      value: 'other',
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
  constructor(private formBuilder: FormBuilder, private incomeService: IncomeService) {}


  submit() {
    this.incomeService.addIncome(this.incomeForm.value).subscribe(income => console.log(income))
  }
}
