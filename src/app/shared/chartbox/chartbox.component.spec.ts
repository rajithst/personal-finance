import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartboxComponent } from './chartbox.component';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {MatCardModule} from "@angular/material/card";
import {MatMenuModule} from "@angular/material/menu";

fdescribe('ChartboxComponent', () => {
  let component: ChartboxComponent;
  let fixture: ComponentFixture<ChartboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChartboxComponent],
      imports: [MatCardModule, MatMenuModule, FaIconComponent],
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

  it('should render chart actions when chart switches are provided', () => {
    const actionElements = fixture.nativeElement.querySelectorAll('.chart-actions button');
    expect(actionElements.length).toBe(2); // Check for the number of buttons
    expect(actionElements[0].textContent).toContain('Option 1');
    expect(actionElements[1].textContent).toContain('Option 2');
  });

  it('should call switchOption when a menu item is clicked', () => {
    spyOn(component, 'switchOption');
    const actionButton = fixture.nativeElement.querySelector('.chart-actions button');
    actionButton.click(); // Simulate click
    expect(component.switchOption).toHaveBeenCalledWith(component.chartSwitches![0]);
  });

  it('should not render actions if chartSwitches is not provided', () => {
    component.chartSwitches = null;
    fixture.detectChanges();

    const actionElements = fixture.nativeElement.querySelectorAll('.chart-actions');
    expect(actionElements.length).toBe(0); // No actions should be rendered
  });
});
