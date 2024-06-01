import { Component } from '@angular/core';
import {faBank, faCirclePlus, faFilter, faLayerGroup, faShop, faTag, faUpload} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-transaction-filter',
  templateUrl: './transaction-filter.component.html',
  styleUrl: './transaction-filter.component.css'
})
export class TransactionFilterComponent {

  protected readonly faUpload = faUpload;
  protected readonly faCirclePlus = faCirclePlus;
  protected readonly faFilter = faFilter;
  protected readonly faLayerGroup = faLayerGroup;
  protected readonly faShop = faShop;
  protected readonly faBank = faBank;
  protected readonly faTag = faTag;
}
