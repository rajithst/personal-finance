import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HoldingTableComponent } from './holding-table.component';

describe('HoldingTableComponent', () => {
  let component: HoldingTableComponent;
  let fixture: ComponentFixture<HoldingTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HoldingTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HoldingTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
