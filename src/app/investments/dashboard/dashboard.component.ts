import {Component, inject, OnInit} from '@angular/core';
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


  private readonly activatedRoute = inject(ActivatedRoute);


  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ investments }) => {
      console.log(investments);
    });
  }


}
