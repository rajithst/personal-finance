import {Component, inject, OnInit} from '@angular/core';
import { Stock } from '../model/stock';
import { ActivatedRoute } from '@angular/router';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrl: './stock.component.scss',
  imports: [JsonPipe],
})
export class StockComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  stock?: Stock;

  constructor() {}

  ngOnInit() {
    this.stock = this.route.snapshot.data['symbol'];
  }
}
