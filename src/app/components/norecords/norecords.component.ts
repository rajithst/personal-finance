import { Component } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';

@Component({
  selector: 'app-norecords',
  template: ` <mat-card appearance="outlined">
    <mat-card-content>
      <p class="no-records-message">No data.</p>
    </mat-card-content>
  </mat-card>`,
  imports: [MatCard, MatCardContent],
  styles: `
    mat-card {
      margin-top: 10px;
    }
    .no-records-message {
      text-align: center;
      font-weight: 800;
      font-size: 14px;
    }
  `,
})
export class NorecordsComponent {}
