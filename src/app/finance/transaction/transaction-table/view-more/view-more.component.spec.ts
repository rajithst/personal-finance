import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionViewMoreDialog } from './view-more.component';

describe('ViewMoreComponent', () => {
  let component: TransactionViewMoreDialog;
  let fixture: ComponentFixture<TransactionViewMoreDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionViewMoreDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionViewMoreDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
