import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface savingType {
  value: string;
  viewValue: string;
}


@Component({
  selector: 'app-savings-add',
  templateUrl: './savings_add.component.html',
  styleUrl: './savings_add.component.css'
})
export class SavingsAddComponent {

  savingsTypes: savingType[] = [
    {
      value: 'emergency-fund',
      viewValue: 'Emergency Fund'
    },
    {
      value: 'investments',
      viewValue: 'Investments'
    },
    {
      value: 'deposit',
      viewValue: 'Deposit'
    }
  ]

  savingsForm = this.formBuilder.group({
    category: ['', Validators.required],
    amount: ['', [Validators.required]],
    date: ['', Validators.required],
    notes: ['']
  });
  constructor(private formBuilder: FormBuilder) {}


  submit() {
    console.log(this.savingsForm)
  }
}
