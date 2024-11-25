import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import { DividendTableComponent } from './dividend-table/dividend-table.component';
import { MatTabGroup, MatTab } from '@angular/material/tabs';

@Component({
  selector: 'app-dividend',
  templateUrl: './dividend.component.html',
  styleUrl: './dividend.component.scss',
  standalone: true,
  imports: [MatTabGroup, MatTab, DividendTableComponent],
})
export class DividendComponent implements OnInit {
  usDividends: any[] = [];
  domesticDividends: any[] = [];
  protected readonly faCaretUp = faCaretUp;
  protected readonly faCaretDown = faCaretDown;

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    this.usDividends = [];
    this.domesticDividends = [];
  }
}
