import {Component, ElementRef, inject, viewChild} from '@angular/core';
import {DataService} from "../../finance/service/data.service";

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrl: './searchbar.component.css'
})
export class SearchbarComponent {
  searchInput = viewChild<ElementRef>('searchInput');

  dataService = inject(DataService);

  applyFilter() {
    const filterValue = this.searchInput()?.nativeElement.value;
    this.dataService.setSearchQuery(filterValue.toLowerCase());
  }
}
