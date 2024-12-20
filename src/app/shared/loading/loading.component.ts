import { Component, inject, Input, OnInit } from '@angular/core';
import { LoadingService } from './loading.service';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  RouteConfigLoadEnd,
  RouteConfigLoadStart,
  Router,
} from '@angular/router';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
    selector: 'loading',
    template: `
    <div class="spinner-container">
      <div class="backdrop"></div>
      <mat-spinner class="spinner"></mat-spinner>
    </div>
  `,
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
      z-index: 1000; /* Ensure it appears above other content */
    }

    .backdrop {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent black */
      z-index: -1; /* Ensure the backdrop is behind the spinner */
    }

    .spinner {
      z-index: 1001; /* Spinner should be above the backdrop */
    }
  `,
    imports: [MatProgressSpinner]
})
export class LoadingComponent implements OnInit {
  @Input()
  routing: boolean = false;

  @Input()
  detectRoutingOngoing = true;

  loadingService = inject(LoadingService);
  router = inject(Router);
  loading = this.loadingService.loading;

  ngOnInit() {
    if (this.detectRoutingOngoing) {
      this.router.events.subscribe((event) => {
        if (
          event instanceof NavigationStart ||
          event instanceof RouteConfigLoadStart
        ) {
          this.loadingService.loadingOn();
        } else if (
          event instanceof NavigationEnd ||
          event instanceof NavigationError ||
          event instanceof NavigationCancel ||
          event instanceof RouteConfigLoadEnd
        ) {
          this.loadingService.loadingOff();
        }
      });
    }
  }
}
