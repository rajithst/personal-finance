import { Component } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loading',

  template: ` <div class="spinner-container">
    <mat-spinner></mat-spinner>
  </div>`,
  styles: `
    .spinner-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
  `,
  imports: [MatProgressSpinner],
})
export class LoadingComponent {}
