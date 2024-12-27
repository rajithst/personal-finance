import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NorecordsComponent } from './norecords.component';

describe('NorecordsComponent', () => {
  let component: NorecordsComponent;
  let fixture: ComponentFixture<NorecordsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NorecordsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NorecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
