import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SessionService } from '../service/session.service';
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-dividend',
  templateUrl: './dividend.component.html',
  styleUrl: './dividend.component.css',
})
export class DividendComponent implements OnInit {
  usDividends: any[] = [];
  domesticDividends: any[] = [];
  protected readonly faCaretUp = faCaretUp;
  protected readonly faCaretDown = faCaretDown;
  private sessionData = this.sessionService.getData();

  constructor(
    private dialog: MatDialog,
    private sessionService: SessionService,
  ) {}

  ngOnInit(): void {
    this.usDividends = this.sessionData.dividends.us;
    this.domesticDividends = this.sessionData.dividends.domestic;
  }
}
