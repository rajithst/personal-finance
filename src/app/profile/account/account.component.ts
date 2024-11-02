import { Component, inject, OnInit } from '@angular/core';
import { MyProfile } from '../../finance/model/profile';
import { DataService } from '../../service/data.service';
import {
  MatTable,
  MatColumnDef,
  MatHeaderCellDef,
  MatHeaderCell,
  MatCellDef,
  MatCell,
  MatRowDef,
  MatRow,
} from '@angular/material/table';
import {
  MatCard,
  MatCardHeader,
  MatCardTitle,
  MatCardContent,
} from '@angular/material/card';

interface ProfileItem {
  label: string;
  value: any;
}

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrl: './account.component.css',
  standalone: true,
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatTable,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCellDef,
    MatCell,
    MatRowDef,
    MatRow,
  ],
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
