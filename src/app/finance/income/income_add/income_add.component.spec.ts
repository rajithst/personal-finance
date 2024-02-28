import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomeAddComponent } from './income_add.component';

describe('AddComponent', () => {
  let component: IncomeAddComponent;
  let fixture: ComponentFixture<IncomeAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IncomeAddComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IncomeAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
