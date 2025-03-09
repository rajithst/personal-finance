import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-reports',
  template: `
    <router-outlet></router-outlet>
  `,
  styles: ``,
  imports: [RouterOutlet],
})
export class ReportsComponent {
}
