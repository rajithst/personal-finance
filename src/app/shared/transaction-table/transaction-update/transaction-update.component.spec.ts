import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseDialog } from './transaction-update.component';

describe('ExpenseDialog', () => {
  let component: ExpenseDialog;
  let fixture: ComponentFixture<ExpenseDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExpenseDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpenseDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
