import {Component, ElementRef, inject, OnDestroy, viewChild} from '@angular/core';
import { DataService } from '../../service/data.service';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrl: './searchbar.component.css',
})
export class SearchbarComponent implements OnDestroy {
  searchInput = viewChild<ElementRef>('searchInput');

  dataService = inject(DataService);

  applyFilter() {
    const filterValue = this.searchInput()?.nativeElement.value;
    this.dataService.setSearchQuery(filterValue.toLowerCase());
  }
  ngOnDestroy() {
    this.dataService.setSearchQuery('');
  }
}
