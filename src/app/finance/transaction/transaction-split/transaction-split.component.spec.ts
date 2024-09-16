import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionSplitComponent } from './transaction-split.component';

describe('TransactionSplitComponent', () => {
  let component: TransactionSplitComponent;
  let fixture: ComponentFixture<TransactionSplitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TransactionSplitComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionSplitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
