import { Component, inject, OnInit } from '@angular/core';
import { MyProfile } from '../../model/profile';
import { DataService } from '../../service/data.service';

interface ProfileItem {
  label: string;
  value: any;
}

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrl: './account.component.css',
})
export class AccountComponent implements OnInit {
  dataService = inject(DataService);
  myAccount: MyProfile | null;
  displayedColumns = ['label', 'value'];
  dataSource: ProfileItem[] = [];

  ngOnInit(): void {
    this.myAccount = this.dataService.getMyProfile();
    this.dataSource = [
      { label: 'First Name', value: this.myAccount?.first_name },
      { label: 'Last Name', value: this.myAccount?.last_name },
      { label: 'Email', value: this.myAccount?.email },
    ];
  }
}
