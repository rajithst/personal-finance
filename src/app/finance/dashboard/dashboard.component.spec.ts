import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransactionDashboardComponent } from './dashboard.component';
import { ApiService } from '../../core/api.service';
import { DataService } from '../../service/data.service';
import { of } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MONTHS } from '../../shared/data/client.data';
import { dashboardData } from '../../mock-data/dashboard';
import { initSettings } from '../../mock-data/init_settings';

describe('TransactionDashboardComponent', () => {
  let component: TransactionDashboardComponent;
  let fixture: ComponentFixture<TransactionDashboardComponent>;
  let apiService: jasmine.SpyObj<ApiService>;
  let dataService: jasmine.SpyObj<DataService>;

  beforeEach(async () => {
    // Mock ApiService and DataService
    const apiServiceSpy = jasmine.createSpyObj('ApiService', [
      'initSettings',
      'getDashboard',
    ]);
    const dataServiceSpy = jasmine.createSpyObj('DataService', [
      'setClientSettings',
      'getAccounts',
      'getAllCategories',
    ]);

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [
        TransactionDashboardComponent,
        MatGridListModule,
        MatCardModule,
        FontAwesomeModule,
      ],
      providers: [
        { provide: ApiService, useValue: apiServiceSpy },
        { provide: DataService, useValue: dataServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionDashboardComponent);
    component = fixture.componentInstance;
    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    dataService = TestBed.inject(DataService) as jasmine.SpyObj<DataService>;

    // Mock data for observables
    apiService.initSettings.and.returnValue(of(initSettings));
    component.dashboardData = dashboardData;

    fixture.detectChanges();
  });

  afterEach(() => {
    component.ngOnDestroy();
  });

  it('should create the TransactionDashboardComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate total income, expenses, payments, and savings', () => {
    // @ts-ignore
    component.prepareAnalytics();
    expect(component.totalIncome).toBe(7735);
    expect(component.totalPayments).toBe(6744);
    expect(component.totalSavings).toBe(6614);
    expect(component.totalExpenses).toBe(-753); // expenses - savings
  });

  it('should set the current month name based on the current month number', () => {
    const currentMonth = MONTHS.find(
      (m) => m.value === component.currentMonthNumber,
    );
    expect(component.currentMonthName).toEqual(
      currentMonth ? currentMonth.viewValue : '',
    );
  });

  it('should render the charts with correct chart data', () => {
    // @ts-ignore
    component.renderCharts();

    component.monthlyExpenseVsPaymentSum$.subscribe((data) => {
      expect(data.chartKey).toEqual('expenseVsPayment');
      expect(data.chartType).toEqual('bar');
    });

    component.monthlyIncomeVsSavingsSum$.subscribe((data) => {
      expect(data.chartKey).toEqual('incomeVsSavings');
      expect(data.chartType).toEqual('bar');
    });

    component.monthlySavings$.subscribe((data) => {
      expect(data.chartKey).toEqual('monthlySavings');
      expect(data.chartType).toEqual('bar');
    });
  });

  it('should unsubscribe from observables on destroy', () => {
    // @ts-ignore
    const spy = spyOn(component.destroyed$, 'next');
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
  });

  it('should update chart data when switchOption is called', () => {
    const chartSwitchEmit = {
      chartKey: 'categoryWiseExpenseSum',
      chartSwitch: { value: 1, viewValue: '', checked: false },
    };
    // @ts-ignore
    spyOn(component, 'prepareLastMonthExpenseCategories');
    component.switchOption(chartSwitchEmit);
    // @ts-ignore
    expect(component.prepareLastMonthExpenseCategories).toHaveBeenCalledWith(
      chartSwitchEmit.chartSwitch,
    );
  });
});
