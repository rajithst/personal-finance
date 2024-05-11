import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionDashboardComponent } from './dashboard.component';

describe('TransactionDashboardComponent', () => {
  let component: TransactionDashboardComponent;
  let fixture: ComponentFixture<TransactionDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TransactionDashboardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
