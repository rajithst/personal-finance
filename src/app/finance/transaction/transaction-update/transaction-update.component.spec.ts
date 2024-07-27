import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionUpdateDialog } from './transaction-update.component';

describe('ExpenseDialog', () => {
  let component: TransactionUpdateDialog;
  let fixture: ComponentFixture<TransactionUpdateDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TransactionUpdateDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionUpdateDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
