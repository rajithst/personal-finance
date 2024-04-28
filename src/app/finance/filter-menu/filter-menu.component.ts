import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {
  DropDownType,
  MONTHS,
  PAYMENT_METHODS,
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

  protected readonly YEARS = YEARS;
  protected readonly MONTHS = MONTHS;
  protected readonly PAYMENT_METHODS = PAYMENT_METHODS;
  protected readonly TRANSACTION_CATEGORIES = TRANSACTION_CATEGORIES;
  protected readonly TRANSACTION_SUB_CATEGORIES: DropDownType[] = [];
  constructor(private route: ActivatedRoute, private router: Router) {}

  categoryParams: number[] = []
  subCategoryParams: number[] = []
  yearParams: number[] = []
  monthParams: number[] = []

  transactionCategories = TRANSACTION_CATEGORIES;
  years = YEARS;
  months = MONTHS;

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.categoryParams = params['cat']?.split(',').map(Number) || [];
      this.subCategoryParams = params['subcat']?.split(',').map(Number) || [];
      this.yearParams = params['years']?.split(',').map(Number) || [2024];
      this.monthParams = params['months']?.split(',').map(Number) || [1, 2, 3];
      this.buildQueryParams()
    })
  }

  buildQueryParams() {
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
      if (target=='category') {
        this.categoryParams.push(item.value)
      }
    } else {

    }
    this.router.navigate(['/expense'], { queryParams: this.prepareQueryParams()})
    // if (this.isSelected(item)) {
    //   this.selectedItems = this.selectedItems.filter(
    //     (selectedItem) => selectedItem !== item,
    //   );
    // } else {
    //   this.selectedItems.push(item);
    // }
    // this.selectedItemsChange.emit(this.selectedItems);
  }

  private prepareQueryParams() {
    const qpm: any = {};
    qpm['cat'] = this.categoryParams.join(',')
    qpm['years'] = this.yearParams.join(',')
    qpm['months'] = this.monthParams.join(',')
    return qpm;
  }
}
