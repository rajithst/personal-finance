import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayeeSettingsComponent } from './payee-settings.component';

describe('PayeeRulesComponent', () => {
  let component: PayeeSettingsComponent;
  let fixture: ComponentFixture<PayeeSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PayeeSettingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayeeSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
