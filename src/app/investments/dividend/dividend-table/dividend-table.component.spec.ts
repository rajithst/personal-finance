import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DividendTableComponent } from './dividend-table.component';

describe('DividendTableComponent', () => {
  let component: DividendTableComponent;
  let fixture: ComponentFixture<DividendTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DividendTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DividendTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
