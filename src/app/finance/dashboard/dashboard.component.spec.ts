import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransactionDashboardComponent } from './dashboard.component';
import { ApiService } from '../../core/api.service';
import { DataService } from '../service/data.service';
import { of } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
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
});
