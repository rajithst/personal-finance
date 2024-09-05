import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionImportComponent } from './transaction-import.component';

describe('TransactionImportComponent', () => {
  let component: TransactionImportComponent;
  let fixture: ComponentFixture<TransactionImportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TransactionImportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TransactionImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
