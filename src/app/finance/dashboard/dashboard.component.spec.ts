import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionDashboardComponent } from './dashboard.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { ChartboxComponent } from '../../shared/chartbox/chartbox.component';
import { of } from 'rxjs';
import { DataService } from '../../service/data.service';
import { dashboardData } from '../../mock-data/dashboard';

describe('TransactionDashboardComponent', () => {
  let component: TransactionDashboardComponent;
  let fixture: ComponentFixture<TransactionDashboardComponent>;
  let mockActivatedRoute: any;
  let mockDataService: any;

  beforeEach(async () => {
    mockActivatedRoute = {
      data: of({
        finance: dashboardData,
      }),
    };
    mockDataService = jasmine.createSpyObj('DataService', [
      'getClientSettings',
    ]);
    mockDataService.getClientSettings.and.returnValue({
      accounts: [],
      transaction_categories: [],
    });
    await TestBed.configureTestingModule({
      declarations: [TransactionDashboardComponent, ChartboxComponent],
      imports: [
        CommonModule,
        RouterModule.forRoot([]),
        BrowserModule,
        MatCardModule,
        MatGridListModule,
        FaIconComponent,
      ],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: DataService, useValue: mockDataService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionDashboardComponent);
    component = fixture.componentInstance;
    component.currentMonthNumber = 1;
    component.currentYear = 2024;
    component.dashboardData = dashboardData;

    component.ngOnInit();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate total income', () => {
    expect(component.totalIncome).toEqual(7735);
  });

  it('should calculate total expenses', () => {
    expect(component.totalExpenses).toEqual(-753);
  });

  it('should calculate total payments', () => {
    expect(component.totalPayments).toEqual(6744);
  });

  it('should calculate total savings', () => {
    expect(component.totalSavings).toEqual(6614);
  });

  it('should display total income correctly', () => {
    fixture.detectChanges();
    const incomeElement = fixture.nativeElement.querySelector('.income-value');
    expect(incomeElement.textContent).toContain('¥7,735.00');
  });

  it('should display total expense correctly', () => {
    fixture.detectChanges();
    const incomeElement = fixture.nativeElement.querySelector('.expense-value');
    expect(incomeElement.textContent).toContain('¥-753.00');
  });

  it('should display total savings correctly', () => {
    fixture.detectChanges();
    const incomeElement = fixture.nativeElement.querySelector('.savings-value');
    expect(incomeElement.textContent).toContain('¥6,614.00');
  });

  it('should display total payments correctly', () => {
    fixture.detectChanges();
    const incomeElement = fixture.nativeElement.querySelector('.payment-value');
    expect(incomeElement.textContent).toContain('¥6,744.00');
  });

  it('should render chart boxes', () => {
    const chartItems = fixture.nativeElement.querySelectorAll('.chart-item');
    expect(chartItems.length).toBe(7); // Adjust based on the number of chart boxes
  });
});
