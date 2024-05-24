import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DividendFlowComponent } from './dividend-flow.component';

describe('DividendFlowComponent', () => {
  let component: DividendFlowComponent;
  let fixture: ComponentFixture<DividendFlowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DividendFlowComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DividendFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
