import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TradeHistoryTableComponent } from './trade-history-table.component';

describe('TradeHistoryTableComponent', () => {
  let component: TradeHistoryTableComponent;
  let fixture: ComponentFixture<TradeHistoryTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TradeHistoryTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TradeHistoryTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
