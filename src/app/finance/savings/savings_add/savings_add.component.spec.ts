import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavingsAddComponent } from './savings_add.component';

describe('AddComponent', () => {
  let component: SavingsAddComponent;
  let fixture: ComponentFixture<SavingsAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SavingsAddComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SavingsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
