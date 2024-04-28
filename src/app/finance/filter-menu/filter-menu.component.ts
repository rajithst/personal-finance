import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {
  DropDownType, INCOME_CATEGORIES,
  MONTHS, PAYMENT_CATEGORIES,
  PAYMENT_METHODS, SAVING_CATEGORIES,
  TRANSACTION_CATEGORIES,
  YEARS,
} from '../../data/client.data';
import {ActivatedRoute, Router} from "@angular/router";
import {months} from "moment";

@Component({
  selector: 'app-filter-menu',
  templateUrl: './filter-menu.component.html',
  styleUrl: './filter-menu.component.css',
})
export class FilterMenuComponent implements OnInit {
  protected URL: string = '';
  constructor(private route: ActivatedRoute, private router: Router) {
    const urlSegmants: string[] = [];
    this.route.url.forEach(x => {
      urlSegmants.push(x.map(x => x.path)[0])
    })
    this.URL = urlSegmants[urlSegmants.length - 1]
  }

  categoryParams: number[] = []
  subCategoryParams: number[] = []
  yearParams: number[] = [2024]
  monthParams: number[] = [1, 2, 3]

  transactionCategories: DropDownType[] = TRANSACTION_CATEGORIES;
  years = YEARS;
  months = MONTHS;

  paramsMap: any  = {
    'category': this.categoryParams,
    'year': this.yearParams,
    'month': this.monthParams
  }

  ngOnInit() {
    if (this.URL === 'savings') {
      this.transactionCategories = SAVING_CATEGORIES;
    } else if (this.URL === 'income') {
      this.transactionCategories = INCOME_CATEGORIES
    } else if (this.URL === 'payments') {
      this.transactionCategories = PAYMENT_CATEGORIES
    }
    this.route.queryParams.subscribe(params => {
      this.categoryParams = params['cat']?.split(',').map(Number) || [];
      this.subCategoryParams = params['subcat']?.split(',').map(Number) || [];
      this.yearParams = params['years']?.split(',').map(Number) || [2024];
      this.monthParams = params['months']?.split(',').map(Number) || [1, 2, 3];
      console.log(this.categoryParams)
      this.buildQueryParams()
    })
  }

  buildQueryParams() {
    this.transactionCategories.forEach(y => y.checked = false);
    this.years.forEach(y => y.checked = false);
    this.months.forEach(y => y.checked = false);
    this.transactionCategories.forEach(y => {
      if (this.categoryParams.includes(y.value)) {
        y.checked = true;
      }
    })
    this.years.forEach(y => {
      if (this.yearParams.includes(y.value)) {
        y.checked = true
      }
    })
    this.months.forEach(y => {
      if (this.monthParams.includes(y.value)) {
        y.checked = true
      }
    })
  }
  toggleItem($event: any, item: any, target: string) {
    if ($event.target.checked) {
      this.paramsMap[target].push(item.value)
    } else {
      const idx = this.paramsMap[target].indexOf(item.value);
      if (idx !== -1)  {
        this.paramsMap[target].splice(idx, 1);
      }
    }
    this.router.navigate([`/${this.URL}`], { queryParams: this.prepareQueryParams()})
  }

  private prepareQueryParams() {
    const qpm: any = {};
    qpm['cat'] = this.paramsMap['category'].join(',')
    qpm['years'] = this.paramsMap['year'].join(',')
    qpm['months'] = this.paramsMap['month'].join(',')
    return qpm;
  }
}
