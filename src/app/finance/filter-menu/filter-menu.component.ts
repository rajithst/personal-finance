import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {
  DropDownType, INCOME_CATEGORIES,
  MONTHS, NA_SUB_CATEGORY_ID, PAYMENT_CATEGORIES, PAYMENT_CATEGORY_ID,
  PAYMENT_METHODS, SAVING_CATEGORIES, SAVINGS_CATEGORY_ID,
  TRANSACTION_CATEGORIES, TRANSACTION_SUB_CATEGORIES,
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
    const urlSegments: string[] = [];
    this.route.url.forEach(x => {
      urlSegments.push(x.map(x => x.path)[0])
    })
    this.URL = urlSegments[urlSegments.length - 1]
  }

  categoryParams: number[] = []
  subCategoryParams: number[] = []
  yearParams: number[] = [2024]
  monthParams: number[] = [1, 2, 3, 4]
  paymentMethodParams: number[] = []

  transactionCategories: DropDownType[] = TRANSACTION_CATEGORIES;
  transactionSubCategories: DropDownType[] = TRANSACTION_SUB_CATEGORIES[NA_SUB_CATEGORY_ID];
  years = YEARS;
  months = MONTHS;
  paymentMethods = PAYMENT_METHODS;

  paramsMap: any  = {
    'category': this.categoryParams,
    'subcategory': this.subCategoryParams,
    'year': this.yearParams,
    'month': this.monthParams,
    'paymentMethod': this.paymentMethodParams,
  }

  ngOnInit() {
    console.log('init filter menu')
    this.route.queryParams.subscribe(params => {
      console.log('subscribing to params on filtermennu')
      this.categoryParams = params['cat']?.split(',').map(Number) || [];
      this.subCategoryParams = params['subcat']?.split(',').map(Number) || [];
      this.yearParams = params['years']?.split(',').map(Number) || [2024];
      this.monthParams = params['months']?.split(',').map(Number) || [1, 2, 3];
      this.paymentMethodParams = params['pm']?.split(',').map(Number) || [];
      this.setDefaultParamValues()
      this.buildQueryParams()
    })
  }

  private setDefaultParamValues() {
    if (this.URL === 'savings') {
      this.transactionCategories = TRANSACTION_SUB_CATEGORIES[SAVINGS_CATEGORY_ID]
      this.categoryParams = [SAVINGS_CATEGORY_ID]
    } else if (this.URL === 'income') {
      this.transactionCategories = INCOME_CATEGORIES
    } else if (this.URL === 'payments') {
      this.transactionCategories = TRANSACTION_SUB_CATEGORIES[PAYMENT_CATEGORY_ID]
      this.categoryParams = [PAYMENT_CATEGORY_ID]
    }
    this.paramsMap['category'] = this.categoryParams;
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
    if (['savings', 'payments'].includes(this.URL)) {
      target = 'subcategory'
    }

    if ($event.target.checked) {
      this.paramsMap[target].push(item.value)
    } else {
      const idx = this.paramsMap[target].indexOf(item.value);
      if (idx !== -1)  {
        this.paramsMap[target].splice(idx, 1);
      }
    }
    this.setDefaultParamValues()
    this.router.navigate([`/${this.URL}`], { queryParams: this.prepareQueryParams()})
  }

  private prepareQueryParams() {
    const qpm: any = {};
    qpm['cat'] = this.paramsMap['category'].filter((x: number) => x !== 0).join(',')
    qpm['subcat'] = this.paramsMap['subcategory'].join(',')
    qpm['years'] = this.paramsMap['year'].join(',')
    qpm['months'] = this.paramsMap['month'].join(',')
    qpm['pm'] = this.paramsMap['paymentMethod'].join(',')
    return qpm;
  }


}
