import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillsAndSubscriptionsComponent } from './bills-and-subscriptions.component';

describe('BillsAndSubscriptionsComponent', () => {
  let component: BillsAndSubscriptionsComponent;
  let fixture: ComponentFixture<BillsAndSubscriptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BillsAndSubscriptionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BillsAndSubscriptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
