import { TestBed, ComponentFixture } from '@angular/core/testing';
import { PayeeSettingsComponent } from './payee-settings.component';

describe('PayeeSettingsComponent', () => {
  let component: PayeeSettingsComponent;
  let fixture: ComponentFixture<PayeeSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayeeSettingsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PayeeSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
