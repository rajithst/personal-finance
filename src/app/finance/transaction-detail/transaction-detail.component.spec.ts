import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionDetailDialog } from './transaction-detail.component';

describe('TransactionDetailDialog', () => {
  let component: TransactionDetailDialog;
  let fixture: ComponentFixture<TransactionDetailDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TransactionDetailDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionDetailDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
