import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionCategoryComponent } from './transaction-category.component';

describe('TransactionCategoryComponent', () => {
  let component: TransactionCategoryComponent;
  let fixture: ComponentFixture<TransactionCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TransactionCategoryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
