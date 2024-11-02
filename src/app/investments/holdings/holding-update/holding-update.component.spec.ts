import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HoldingUpdateComponent } from './holding-update.component';

describe('HoldingUpdateComponent', () => {
  let component: HoldingUpdateComponent;
  let fixture: ComponentFixture<HoldingUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [HoldingUpdateComponent],
}).compileComponents();

    fixture = TestBed.createComponent(HoldingUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
