import { Component, input, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatListItem, MatListItemMeta } from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';
import { MenuItem } from '../sidenav/sidenav.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-nav-item',
  templateUrl: './nav-item.component.html',
  styleUrl: './nav-item.component.scss',
  standalone: true,
  imports: [
    RouterLink,
    MatListItem,
    MatIcon,
    RouterLinkActive,
    NgIf,
    MatListItemMeta,
  ],
})
export class NavItemComponent {
  item = input.required<MenuItem>();
  collapsed = input(false);
  nestedMenuOpen = signal(false);

  toggleNested() {
    if (this.item()?.children) {
      this.nestedMenuOpen.set(!this.nestedMenuOpen());
    }
  }
}
