import { Component, inject, OnInit } from '@angular/core';
import { NgClass, DecimalPipe } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatGridList, MatGridTile } from '@angular/material/grid-list';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../core/api.service';
import { ReplaySubject, takeUntil } from 'rxjs';
import {
  Widget,
  WidgetComponent,
} from '../../components/widget/widget.component';
import { TotalInvestmentWidget } from './widgets/summary-widgets';
import { PortfolioAllocationWidget } from './widgets/chart-widgets';

@Component({
  selector: 'app-portfolio',
  template: `
    <div class="dashboard-widgets">
      @for (widget of widgets; track widget) {
        <app-widget [data]="widget"></app-widget>
      }
    </div>
  `,
  styles: `
    .dashboard-widgets {
      height: 99%;
      overflow-y: auto;
      display: grid;
      grid-template-columns: repeat(4, minmax(200px, 1fr));
      grid-auto-rows: 120px;
      gap: 10px;
    }
  `,
  standalone: true,
  imports: [
    MatGridList,
    MatGridTile,
    MatCard,
    MatCardContent,
    FaIconComponent,
    NgClass,
    DecimalPipe,
    WidgetComponent,
  ],
})
export class PortfolioComponent implements OnInit {
  private readonly apiService = inject(ApiService);
  protected readonly destroyed$ = new ReplaySubject<void>(1);

  widgets: Widget[] = [];
  constructor() {
    const activatedRoute = inject(ActivatedRoute);
    activatedRoute.data
      .pipe(takeUntil(this.destroyed$))
      .subscribe(({ investments }) => {
        console.log(investments);
      });
  }

  ngOnInit(): void {
    this.prepareWidgets();
  }

  prepareWidgets() {
    this.widgets = [
      {
        id: 1,
        label: 'Portfolio Value',
        content: TotalInvestmentWidget,
        rows: 1,
        columns: 1,
        backgroundColor: '#003f5c',
        color: 'whitesmoke',
        hideSettingsButton: true,
      },
      {
        id: 1,
        label: 'Total Profit',
        content: TotalInvestmentWidget,
        rows: 1,
        columns: 1,
        backgroundColor: '#003f5c',
        color: 'whitesmoke',
        hideSettingsButton: true,
      },
      {
        id: 1,
        label: 'IRR',
        content: TotalInvestmentWidget,
        rows: 1,
        columns: 1,
        backgroundColor: '#003f5c',
        color: 'whitesmoke',
        hideSettingsButton: true,
      },
      {
        id: 1,
        label: 'Passive Income',
        content: TotalInvestmentWidget,
        rows: 1,
        columns: 1,
        backgroundColor: '#003f5c',
        color: 'whitesmoke',
        hideSettingsButton: true,
      },
      {
        id: 1,
        label: 'Portfolio',
        content: PortfolioAllocationWidget,
        rows: 1,
        columns: 2,
        hideSettingsButton: true,
      },
    ];
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
