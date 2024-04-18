import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PfPieChartComponent } from './pf-pie-chart.component';

describe('PfPieChartComponent', () => {
  let component: PfPieChartComponent;
  let fixture: ComponentFixture<PfPieChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PfPieChartComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PfPieChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
