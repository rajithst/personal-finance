import { Component, OnInit } from '@angular/core';
import { Stock } from '../model/stock';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrl: './stock.component.css',
})
export class StockComponent implements OnInit {
  stock?: Stock;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.stock = this.route.snapshot.data['symbol'];
  }
}
