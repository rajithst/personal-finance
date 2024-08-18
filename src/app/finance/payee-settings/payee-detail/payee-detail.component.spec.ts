import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayeeDetailComponent } from './payee-detail.component';

describe('PayeeDetailComponent', () => {
  let component: PayeeDetailComponent;
  let fixture: ComponentFixture<PayeeDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PayeeDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PayeeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
