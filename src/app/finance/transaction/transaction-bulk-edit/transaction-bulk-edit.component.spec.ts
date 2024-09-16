import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionBulkEditComponent } from './transaction-bulk-edit.component';

describe('TransactionBulkEditComponent', () => {
  let component: TransactionBulkEditComponent;
  let fixture: ComponentFixture<TransactionBulkEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TransactionBulkEditComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionBulkEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
