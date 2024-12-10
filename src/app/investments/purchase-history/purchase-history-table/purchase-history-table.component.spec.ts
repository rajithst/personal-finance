import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseHistoryTableComponent } from './purchase-history-table.component';

describe('TradeHistoryTableComponent', () => {
  let component: PurchaseHistoryTableComponent;
  let fixture: ComponentFixture<PurchaseHistoryTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchaseHistoryTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PurchaseHistoryTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
