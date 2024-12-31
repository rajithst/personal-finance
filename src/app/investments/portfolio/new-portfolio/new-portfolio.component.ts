import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent, MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatOption } from '@angular/material/autocomplete';
import { MatSelect } from '@angular/material/select';
import { InvestmentStore } from '../../../core/store/investment.store';
import {Portfolio} from "../../model/portfolio";

@Component({
  selector: 'app-new-portfolio',
  templateUrl: './new-portfolio.component.html',
  imports: [
    MatButton,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    MatLabel,
    MatFormField,
    MatInput,
    ReactiveFormsModule,
    MatOption,
    MatSelect,
  ],
  styleUrl: './new-portfolio.component.scss',
})
export class NewPortfolioComponent {
  private readonly store = inject(InvestmentStore);
  private readonly dialogRef = inject(MatDialogRef<NewPortfolioComponent>);

  portfolioForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    goal: new FormControl(''),
    goal_amount: new FormControl(''),
    currency: new FormControl(''),
    description: new FormControl(''),
  });

  cancel() {
    this.dialogRef.close();
  }

  async  submit() {
    if (this.portfolioForm.invalid) {
      return;
    }
    const formValue = this.portfolioForm.value as Portfolio;
    const updatedPortfolio = await this.store.createPortfolio(formValue);
    this.dialogRef.close(updatedPortfolio);
  }
}
