import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class BreadcrumbService {
  breadcrumbs: Array<{ label: string; url: string }> = [];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.createBreadcrumbs(this.activatedRoute.root);
      });
  }

  private createBreadcrumbs(
    route: ActivatedRoute,
    url: string = '',
    breadcrumbs: Array<{
      label: string;
      url: string;
    }> = [],
  ): void {
    const children: ActivatedRoute[] = route.children;

    if (children.length === 0) {
      this.breadcrumbs = breadcrumbs;
      return;
    }

    children.forEach((child) => {
      const routeURL = child.snapshot.routeConfig?.path ?? '';
      const breadcrumbLabel = child.snapshot.data['breadcrumb'];
      const appendUrlSuffix = child.snapshot.data['appendUrlSuffixToLabel'];

      if (routeURL !== '') {
        url += `/${routeURL}`;
        if (appendUrlSuffix) {
        }
        if (breadcrumbLabel) {
          breadcrumbs.push({ label: breadcrumbLabel, url });
        }
      }

      this.createBreadcrumbs(child, url, breadcrumbs);
    });
  }
}
