import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  menuItems = [
    {'name': 'Basic Info', link: 'me'},
    {'name': 'Account Security', link: 'security'},
    {'name': 'Billing', link: 'billing'},

  ];
}
