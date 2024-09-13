import { Component } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {

  menuItems = [
    {'name': 'Category settings', link: 'category-settings'},
    {'name': 'Accounts', link: 'accounts'},
    {'name': 'Logs', link: 'user-log'}];

}
