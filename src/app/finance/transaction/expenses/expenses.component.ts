import {
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { SessionService } from '../../service/session.service';
import { MonthlyTransaction } from '../../model/transactions';
import { LoadingService } from '../../../shared/loading/loading.service';
import { MatAccordion } from '@angular/material/expansion';
import { DataService } from '../../service/data.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrl: './expenses.component.css',
})
export class ExpensesComponent implements OnInit {
  @ViewChild('filterButton') element: ElementRef;
  @ViewChild(MatAccordion) accordion: MatAccordion;

  private sessionService = inject(SessionService);
  private dataService = inject(DataService);
  private loadingService = inject(LoadingService);

  sessionData = this.sessionService.getData();
  transactionData: MonthlyTransaction[] = [];

  ngOnInit(): void {
    this.dataService.setBulkSelectTransactions([]);
    this.filterData();
    this.dataService.updatedTransaction$
      .pipe(filter((value) => !!value))
      .subscribe(() => this.filterData());

    this.dataService.updatedFilters$
      .pipe(filter((value) => !!value))
      .subscribe(() => this.filterData());

    this.dataService.triggerPanels$
      .pipe(filter((value) => value !== null))
      .subscribe((value) => this.expandPanels(value as boolean));

    this.dataService.yearSwitch$
      .pipe(filter((value) => !!value))
      .subscribe(() => this.filterData());

    this.dataService.searchTransaction$
      .pipe(filter((value) => !!value))
      .subscribe(() => this.filterData());
  }

  filterData() {
    const currData = this.sessionService.filterTransactions('transaction');
    this.transactionData = JSON.parse(JSON.stringify(currData));
    this.loadingService.loadingOff();
  }

  expandPanels(expandAll: boolean) {
    if (expandAll && this.accordion) {
      this.accordion.openAll();
    } else {
      this.accordion.closeAll();
    }
  }
}
