import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddComponent } from '../add/add.component';
import {FormGroup, FormControl} from '@angular/forms';

@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrl: './listing.component.css'
})
export class ListingComponent {

  constructor(public dialog: MatDialog) {}

  savingRange = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  displayedColumns: string[] = ['date', 'source', 'amount'];
  savingData = [
    { year: '2024', month: 'January',  incomes: [
      { date: '2024-01-27', source: 'Emergency Fund', amount: 1000 },
      { date: '2024-01-27', source: 'Investments', amount: 1000 },
    ]},
    { year: '2024', month: 'February', incomes: [
      { date: '2024-02-27', source: 'Emergency Fund', amount: 1200 },
    ]}
    // Add more months as needed
  ];

  addSaving() {
    this.dialog.open(AddComponent, {
      width: '750px',
      position: {
        top: '50px',
      },
    });
  }

}
