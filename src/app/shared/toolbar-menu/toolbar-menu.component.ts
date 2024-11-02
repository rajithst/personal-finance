import { Component, Input } from '@angular/core';
import { MenuItem } from '../../finance/model/common';
import { RouterLinkActive, RouterLink } from '@angular/router';

@Component({
    selector: 'app-toolbar-menu',
    templateUrl: './toolbar-menu.component.html',
    styleUrl: './toolbar-menu.component.css',
    standalone: true,
    imports: [RouterLinkActive, RouterLink],
})
export class ToolbarMenuComponent {
  @Input() menuItems: MenuItem[];
}
