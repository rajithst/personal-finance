import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserProfile } from '../../auth/model';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrl: './account.component.css',
})
export class AccountComponent implements OnInit {
  activatedRoute = inject(ActivatedRoute);
  myAccount: UserProfile;
  profileSections = [
    { key: 'info', label: 'Basic Info', selected: true },
    { key: 'account', label: 'Account', selected: false },
    { key: 'privacy', label: 'Privacy', selected: false },
    { key: 'subscription', label: 'Subscription', selected: false },
  ];
  selectedSection = 'info';

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ myAccount }) => {
      this.myAccount = myAccount;
    });
  }

  onSelected(item: { label: string; key: string }) {
    this.profileSections.forEach((section) => {
      section.selected = section.key === item.key;
    });
    this.selectedSection = item.key;
  }
}
