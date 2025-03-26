import { Component, inject } from '@angular/core';
import { DataService } from '../../service/data.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  template: `
    <div class="search-container">
      <input
        type="text"
        class="search-input"
        placeholder="Search..."
        [(ngModel)]="searchInput"
        (keyup)="onSearch()"
      />
      @if (searchInput !== '') {
        <button class="search-button" (click)="onClear()">✖️</button>
      }
    </div>
  `,
  styles: `
    .search-container {
      display: flex;
      align-items: center;
      background-color: #fff;
      border-radius: 25px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      padding: 2px 2px 2px 15px;
      width: 400px;
    }

    .search-input {
      border: none;
      outline: none;
      padding: 8px 10px;
      font-size: 14px;
      width: 100%;
      border-radius: 25px;
      box-sizing: border-box;
    }

    .search-button {
      border: none;
      padding: 5px;
      border-radius: 50%;
      cursor: pointer;
      margin-left: 10px;
      font-size: 14px;
      color: white;
    }
  `,
  imports: [FormsModule],
})
export class SearchBarComponent {
  private readonly dataService = inject(DataService);
  searchInput = '';
  query = '';

  onSearch() {
    this.dataService.setSearchQuery(this.searchInput);
  }

  onClear() {
    this.searchInput = '';
    this.onSearch();
  }
}
