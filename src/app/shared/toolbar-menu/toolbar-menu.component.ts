import { Component, Input } from '@angular/core';
import { MenuItem } from '../../model/common';

@Component({
  selector: 'app-toolbar-menu',
  templateUrl: './toolbar-menu.component.html',
  styleUrl: './toolbar-menu.component.css',
})
export class ToolbarMenuComponent {
  @Input() menuItems: MenuItem[];
}
