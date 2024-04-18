import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PfBarChartComponent } from './pf-bar-chart.component';

describe('PfBarChartComponent', () => {
  let component: PfBarChartComponent;
  let fixture: ComponentFixture<PfBarChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PfBarChartComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PfBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
