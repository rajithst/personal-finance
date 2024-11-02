import {Component, Input} from '@angular/core';
import {MenuItem} from "../../finance/model/common";
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { RouterLinkActive, RouterLink } from '@angular/router';
import { MatListItem } from '@angular/material/list';

@Component({
    selector: 'app-nav-item',
    templateUrl: './nav-item.component.html',
    styleUrl: './nav-item.component.css',
    standalone: true,
    imports: [MatListItem, RouterLinkActive, RouterLink, FaIconComponent]
})
export class NavItemComponent {

  @Input() menuItems: MenuItem[]

}
