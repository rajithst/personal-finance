import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartboxComponent } from './chartbox.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';

fdescribe('ChartboxComponent', () => {
  let component: ChartboxComponent;
  let fixture: ComponentFixture<ChartboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatCardModule,
        MatMenuModule,
        FaIconComponent,
        ChartboxComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ChartboxComponent);
    component = fixture.componentInstance;
    component.chartTitle = 'Test Chart';
    component.chartSwitches = [
      {
        value: 1,
        viewValue: 'Option 1',
        checked: false,
      },
      {
        value: 2,
        viewValue: 'Option 2',
        checked: false,
      },
    ];
    fixture.detectChanges(); // Trigger initial data binding
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should display the chart title', () => {
    const titleElement = fixture.nativeElement.querySelector('mat-card-title');
    expect(titleElement.textContent).toContain('Test Chart');
  });

  it('should not render actions if chartSwitches is not provided', () => {
    component.chartSwitches = null;
    fixture.detectChanges();

    const actionElements =
      fixture.nativeElement.querySelectorAll('.chart-actions');
    expect(actionElements.length).toBe(0); // No actions should be rendered
  });
});
