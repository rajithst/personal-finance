import { TestBed, ComponentFixture, waitForAsync } from '@angular/core/testing';
import { PayeeSettingsComponent } from './payee-settings.component';
import { Title } from '@angular/platform-browser';
import { DataService } from '../../service/data.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import {payees} from "../../mock-data/payees";

describe('PayeeSettingsComponent', () => {
  let component: PayeeSettingsComponent;
  let fixture: ComponentFixture<PayeeSettingsComponent>;
  let dataServiceSpy: jasmine.SpyObj<DataService>;
  let titleServiceSpy: jasmine.SpyObj<Title>;
  let activatedRouteStub: Partial<ActivatedRoute>;

  beforeEach(waitForAsync(() => {
    // Mock DataService
    dataServiceSpy = jasmine.createSpyObj('DataService', ['setPayees', 'setSearchQuery']);
    titleServiceSpy = jasmine.createSpyObj('Title', ['setTitle', 'getTitle']);
    titleServiceSpy.getTitle.and.returnValue('Mock Title');
    // Stub ActivatedRoute with a mock observable for data
    activatedRouteStub = {
      data: of({ payeeData: { payees: payees } }),
    };

    TestBed.configureTestingModule({
      imports: [PayeeSettingsComponent],
      providers: [
        { provide: DataService, useValue: dataServiceSpy },
        { provide: Title, useValue: titleServiceSpy },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayeeSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call DataService.setPayees with payee data on init', () => {
    component.ngOnInit();
    expect(dataServiceSpy.setPayees).toHaveBeenCalledWith(payees);
  });
});
