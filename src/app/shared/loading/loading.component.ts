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
import { MatProgressBar } from '@angular/material/progress-bar';
import {MatProgressSpinner} from "@angular/material/progress-spinner";

@Component({
  selector: 'loading',
  template: `
    @if (loading()) {
      <mat-spinner></mat-spinner>
    }
  `,
  styles: `
    .spinner-container {
      position: fixed;
      height: 100vh;
      width: 100vw;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      background: rgba(0, 0, 0, 0.32);
      z-index: 20000;
    }
  `,
  standalone: true,
  imports: [MatProgressBar, MatProgressSpinner],
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
