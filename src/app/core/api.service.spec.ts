import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { ApiService } from './api.service';
import { environment } from '../../environments/environment';
import { JwtTokenResponse } from '../auth/model';
import { DashboardResponse } from '../finance/model/dashboard';

import { PayeeResponse } from '../finance/model/payee';
import { dashboardData } from '../mock-data/dashboard';
import { payees } from '../mock-data/payees';
import { provideHttpClient } from '@angular/common/http';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;
  const SRC_URL = environment.apiUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [ApiService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call login API with correct payload', () => {
    const loginPayload = { username: 'test', password: 'password' };
    const mockResponse: JwtTokenResponse = {
      token: 'fake-jwt-token',
      refresh: 'refresh-token',
      is_premium: false,
    };

    service.login(loginPayload).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${SRC_URL}/auth/jwt/create`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(loginPayload);
    req.flush(mockResponse);
  });

  it('should call getDashboard API and return data', () => {
    const mockResponse: DashboardResponse = dashboardData;

    service.getDashboard().subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${SRC_URL}/finance/dashboard/`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should call getPayees API and return data', () => {
    const mockResponse: PayeeResponse = { payees };

    service.getPayees().subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${SRC_URL}/finance/payee/`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});
