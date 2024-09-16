import { Component, inject, Input, OnInit } from '@angular/core';
import { HttpContextToken } from '@angular/common/http';
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

@Component({
  selector: 'loading',
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.css',
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

export const SkipLoading = new HttpContextToken(() => false);
