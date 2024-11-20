import { Component } from '@angular/core';

@Component({
    selector: 'app-page-not-found',
    template: `
      <div class="not-found">
        <h1>Page Not Found</h1>
        <p>Did you mistype something in the browser address bar?</p>
      </div>
    `,
    styles: `
      .not-found {
        padding: 40px;
        display: flex;
        flex-direction: column;
      }
    `,
    standalone: true,
})
export class PageNotFoundComponent {}
