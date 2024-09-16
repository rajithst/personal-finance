import {Component, Input} from '@angular/core';
import {MenuItem} from "../../model/common";

@Component({
  selector: 'app-nav-item',
  templateUrl: './nav-item.component.html',
  styleUrl: './nav-item.component.css'
})
export class NavItemComponent {

  @Input() menuItems: MenuItem[]

}
