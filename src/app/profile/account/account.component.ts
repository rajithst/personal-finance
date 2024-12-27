import { Component, inject, OnInit } from '@angular/core';
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
import { AuthStore } from '../../auth/auth.store';

interface ProfileItem {
  label: string;
  value: any;
}

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss',
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
  providers: [AuthStore],
})
export class AccountComponent implements OnInit {
  private readonly authStore = inject(AuthStore);
  displayedColumns = ['label', 'value'];
  dataSource: ProfileItem[] = [];
  myProfile = this.authStore.profile();

  ngOnInit(): void {
    this.dataSource = [
      { label: 'First Name', value: this.myProfile?.first_name },
      { label: 'Last Name', value: this.myProfile?.last_name },
      { label: 'Email', value: this.myProfile?.email },
    ];
  }
}
