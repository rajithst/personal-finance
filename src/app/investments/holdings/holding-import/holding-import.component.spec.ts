import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HoldingImportComponent } from './holding-import.component';

describe('HoldingImportComponent', () => {
  let component: HoldingImportComponent;
  let fixture: ComponentFixture<HoldingImportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HoldingImportComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HoldingImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
