import {Component, inject, OnInit} from '@angular/core';
import {
  faCaretDown,
  faCaretUp,
  faJpy,
  faLineChart,
  faMoneyBill,
} from '@fortawesome/free-solid-svg-icons';
import { NgClass, DecimalPipe } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatGridList, MatGridTile } from '@angular/material/grid-list';
import {ActivatedRoute} from "@angular/router";

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss',
    standalone: true,
    imports: [
        MatGridList,
        MatGridTile,
        MatCard,
        MatCardContent,
        FaIconComponent,
        NgClass,
        DecimalPipe,
    ],
})
export class InvestmentDashboardComponent implements OnInit {

  protected readonly faCaretUp = faCaretUp;
  protected readonly faLineChart = faLineChart;
  protected readonly faJpy = faJpy;
  protected readonly faMoneyBill = faMoneyBill;
  protected readonly faCaretDown = faCaretDown;
  protected readonly Math = Math;

  private readonly activatedRoute = inject(ActivatedRoute);


  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ investments }) => {
      console.log(investments);
    });
  }


}
