import {Component, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrl: './top-nav.component.css'
})
export class TopNavComponent {

  @Output() sideNavToggled = new EventEmitter<void>();
  constructor() {}

  toggleSidebar(): void {
    this.sideNavToggled.emit();
  }

}
