import {Component, EventEmitter, Input, Output} from '@angular/core';
import {DropDownType} from '../../../data/client.data';

@Component({
  selector: 'app-multi-select-drop-down',
  templateUrl: './multi-select-drop-down.component.html',
  styleUrl: './multi-select-drop-down.component.css'
})
export class MultiSelectDropDownComponent {

  @Input() title: string = 'Category'
  @Input() items: DropDownType[] = [];
  @Input() selectedIds: number[] = []
  @Output() selectedItemsChange: EventEmitter<any[]> = new EventEmitter<any[]>();

  selectedItems: DropDownType[] = [];

  ngOnChanges() {
    if (this.selectedIds) {
      this.selectedItems = [];
      this.items.forEach(x => {
        if (this.selectedIds.includes(x.value)){
          this.selectedItems.push(x)
        }
      })
      this.selectedItemsChange.emit(this.selectedItems);
    }
  }
  toggleItem(item: any) {
    if (this.isSelected(item)) {
      this.selectedItems = this.selectedItems.filter(selectedItem => selectedItem !== item);
    } else {
      this.selectedItems.push(item);
    }
    this.selectedItemsChange.emit(this.selectedItems);
  }

  isSelected(item: any): boolean {
    return this.selectedItems.indexOf(item) > -1;
  }
}
