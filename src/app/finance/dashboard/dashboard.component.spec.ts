
import { TransactionDashboardComponent } from './dashboard.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';

describe('TransactionDashboardComponent', () => {
  let component: TransactionDashboardComponent;
  let fixture: ComponentFixture<TransactionDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionDashboardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
