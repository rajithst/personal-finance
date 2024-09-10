import {Component, inject, OnInit} from '@angular/core';
import {faPencil} from '@fortawesome/free-solid-svg-icons';
import {TransactionCategory, TransactionSubCategory} from "../../finance/model/common";
import {DataService} from "../../finance/service/data.service";

interface CategorySettings {
  category: TransactionCategory;
  subCategories: TransactionSubCategory[] | null;
}
@Component({
  selector: 'app-transaction-category',
  templateUrl: './transaction-category.component.html',
  styleUrl: './transaction-category.component.css',
})
export class TransactionCategoryComponent implements OnInit {
  protected readonly faPencil = faPencil;

  dataService = inject(DataService);
  allCategories: TransactionCategory[] = this.dataService.getAllCategories();
  allSubCategories: TransactionSubCategory[] = this.dataService.getAllSubCategories();
  categorySettings: CategorySettings[] = []
  displayedColumns: string[] = ['name', 'description'];
  ngOnInit() {
    this.allCategories.forEach(category => {
      const subs = this.allSubCategories.filter((sub) => category.id === sub.category);
      this.categorySettings.push({category: category, subCategories: subs});
    })
  }

  editCategory(i: number) {

  }
}
