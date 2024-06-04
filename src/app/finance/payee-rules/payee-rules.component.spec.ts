import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayeeRulesComponent } from './payee-rules.component';

describe('PayeeRulesComponent', () => {
  let component: PayeeRulesComponent;
  let fixture: ComponentFixture<PayeeRulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PayeeRulesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PayeeRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
