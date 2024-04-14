import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {EXPENSE_CATEGORIES, MONTHS, PAYMENT_METHODS, SAVING_CATEGORIES, YEARS} from "../static/client_data";
import {DropDownType} from "../interface/common.data";

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.css'
})
export class ToolbarComponent implements OnInit {

  @Output() toolbarFilters = new EventEmitter<any>();

  protected readonly YEARS = YEARS;
  protected readonly MONTHS = MONTHS;
  protected readonly SAVING_CATEGORIES = SAVING_CATEGORIES;
  protected readonly EXPENSE_CATEGORIES = EXPENSE_CATEGORIES;
  protected readonly EXPENSE_SUB_CATEGORIES: DropDownType[] = [];
  protected readonly PAYMENT_METHODS = PAYMENT_METHODS;

  dataYear: number[] = [2024];
  dataMonth: number[] = [1, 2, 3];
  paymentMethod: number[] = []
  expenseCategory: number[] = []
  expenseSubCategory: number[] = []
  searchQuery: string = '';

  ngOnInit(): void {
    this.onSelectionChange()
  }


  onSelectionChange() {
    console.log('emitting')
    this.toolbarFilters.emit(this.prepareFilters())
  }
  prepareFilters() {
    return {
      'years': this.dataYear,
      'months': this.dataMonth,
      'paymentMethods': this.paymentMethod,
      'categories': this.expenseCategory,
      'subcategories': this.expenseSubCategory,
      'q': this.searchQuery
    }
  }
  onSearch() {
    //this.prepareTableData();
  }

  addTransaction() {

  }

}
